import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { blogLayoutApi } from '../../../../api/blog-layout';
import { blogLayoutItemApi } from '../../../../api/blog-layout-item';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { BlogLayoutItemCreateModal } from '../../../../sections/blog-layout-item/blog-layout-item-create-modal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { BlogLayoutItemCard } from '../../../../sections/blog-layout-item/blog-layout-item-card';
import { es } from 'date-fns/locale';

const useBlogLayout = (blogLayoutId) => {
  const isMounted = useMounted();
  const [blogLayout, setBlogLayout] = useState();

  const getBlogLayout = useCallback(
    async (id) => {
      try {
        const response = await blogLayoutApi.getBlogLayout(id);

        if (isMounted()) {
          setBlogLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getBlogLayout(blogLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blogLayoutId],
  );

  return blogLayout;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const blogLayout = useBlogLayout(id);
  const [name, setName] = useState();
  const [blogItems, setBlogItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  usePageView();

  useEffect(() => {
    setName(blogLayout?.name);
  }, [blogLayout]);

  const getBlogItems = useCallback(() => {
    blogLayoutItemApi
      .getBlogLayoutItems({
        blogId: id,
      })
      .then((res) => {
        setBlogItems(res.items);
      });
  }, [id]);

  useEffect(() => {
    getBlogItems();
  }, [id, getBlogItems]);
  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  if (!blogLayout) {
    return null;
  }

  const createdAt = format(
    new Date(blogLayout.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await blogLayoutApi.updateBlogLayout(id, {
        name,
      });
      toast.success('Blog actualizado correctamente');
      router.push(paths.adminContent.home.blogs);
    } catch (error) {}
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      blogItems,
      result.source.index,
      result.destination.index,
    );
    setBlogItems(newItems);

    blogLayoutItemApi.orderItems(newItems).then((res) => {
      getBlogItems();
    });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onCreateItem = async (data) => {
    event.preventDefault();
    try {
      const response = await blogLayoutItemApi.createBlogLayoutItem({
        order: blogItems.length,
        source: data.source,
        title: data.title,
        subtitle: data.subtitle,
        id_blog_layout: id,
        id_button: data.id_button,
      });
      getBlogItems();
      setOpenCreateModal(false);
      toast.success('Blog creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Diseño blog # {blogLayout.id} | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.adminContent.home.blogs}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Diseño del blog</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del blog # {blogLayout.id}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography color="text.secondary" variant="body2">
                    Realizado el
                  </Typography>
                  <SvgIcon color="action">
                    <CalendarIcon />
                  </SvgIcon>
                  <Typography variant="body2">{createdAt}</Typography>
                </Stack>

                <form onSubmit={handleUpdateProduct}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="filled"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}
                  >
                    <Button size="large" variant="contained" type="submit">
                      Actualizar
                    </Button>
                  </Box>
                </form>

                <Stack
                  justifyContent="space-between"
                  alignItems="center"
                  direction="row"
                  sx={{ py: 3 }}
                >
                  <Typography variant="h5">Blog items</Typography>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    onClick={openCreateDialog}
                  >
                    Create Blog Item
                  </Button>
                </Stack>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <DragDropContext onDragEnd={handleDragEnd}>
                    {blogItems.map((blogItem, index) => (
                      <Droppable
                        droppableId={blogItem.id.toString()}
                        type="task"
                        direction="horizontal"
                        key={index}
                      >
                        {(provided) => (
                          <div
                            key={blogItem.id}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <BlogLayoutItemCard
                              blogItem={blogItem}
                              index={index}
                              refetch={getBlogItems}
                              onEdit={() => openEditDialog(blogItem)}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </DragDropContext>
                </Box>
              </Stack>
            </div>
          </Stack>
          <BlogLayoutItemCreateModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={onCreateItem}
            selectedItem={selectedItem}
            refetch={getBlogItems}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
