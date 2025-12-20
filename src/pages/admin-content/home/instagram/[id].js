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
  Link,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { instagramLayoutApi } from '../../../../api/instagram-layout';
import { instagramLayoutItemApi } from '../../../../api/instagram-layout-item';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { InstagramLayoutItemCreateModal } from '../../../../sections/instagram-layout-item/instagram-layout-item-create-modal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { InstagramLayoutItemCard } from '../../../../sections/instagram-layout-item/instagram-layout-item-card';
import { es } from 'date-fns/locale';

const useInstagramLayout = (instagramLayoutId) => {
  const isMounted = useMounted();
  const [instagramLayout, setInstagramLayout] = useState();

  const getInstagramLayout = useCallback(
    async (id) => {
      try {
        const response = await instagramLayoutApi.getInstagramLayout(id);

        if (isMounted()) {
          setInstagramLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getInstagramLayout(instagramLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instagramLayoutId],
  );

  return instagramLayout;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const instagramLayout = useInstagramLayout(id);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [footer, setFooter] = useState('');
  const [instagramItems, setInstagramItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  usePageView();

  useEffect(() => {
    setName(instagramLayout?.name);
    setTitle(instagramLayout?.title);
    setFooter(instagramLayout?.footer);
  }, [instagramLayout]);

  const getInstagramItems = useCallback(() => {
    instagramLayoutItemApi
      .getInstagramLayoutItems({
        instagramId: id,
      })
      .then((res) => {
        setInstagramItems(res.items);
      });
  }, [id]);

  useEffect(() => {
    getInstagramItems();
  }, [id, getInstagramItems]);

  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  if (!instagramLayout) {
    return null;
  }

  const createdAt = format(
    new Date(instagramLayout.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await instagramLayoutApi.updateInstagramLayout(id, {
        name,
        title,
        footer,
      });
      toast.success('Instagram actualizado correctamente');
      router.push(paths.adminContent.home.instagram);
    } catch (error) {}
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      instagramItems,
      result.source.index,
      result.destination.index,
    );
    setInstagramItems(newItems);

    instagramLayoutItemApi.orderItems(newItems).then((res) => {
      getInstagramItems();
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
      const response = await instagramLayoutItemApi.createInstagramLayoutItem({
        order: instagramItems.length,
        source: data.source,
        url: data.url,
        id_instagram_layout: id,
      });
      getInstagramItems();
      setOpenCreateModal(false);
      toast.success('Instagram creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Diseño Instagram # {instagramLayout.id} | PACOMARTINEZ</title>
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
                href={paths.adminContent.home.instagram}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">
                  Diseño del instagram
                </Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del Slider Instagram # {instagramLayout.id}
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
                    label="Nombre"
                    variant="filled"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Titulo"
                    variant="filled"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Footer"
                    variant="filled"
                    value={footer}
                    onChange={(event) => setFooter(event.target.value)}
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
                  <Typography variant="h5">Instagram items</Typography>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    onClick={openCreateDialog}
                  >
                    Crear item
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
                    {instagramItems.map((instagramItem, index) => (
                      <Droppable
                        droppableId={instagramItem.id.toString()}
                        type="task"
                        direction="horizontal"
                        key={index}
                      >
                        {(provided) => (
                          <div
                            key={instagramItem.id}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <InstagramLayoutItemCard
                              instagramItem={instagramItem}
                              index={index}
                              refetch={getInstagramItems}
                              onEdit={() => openEditDialog(instagramItem)}
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
          <InstagramLayoutItemCreateModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={onCreateItem}
            selectedItem={selectedItem}
            refetch={getInstagramItems}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
