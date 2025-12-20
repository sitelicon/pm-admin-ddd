import { useCallback, useEffect, useMemo, useState } from 'react';
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
  styled,
} from '@mui/material';
import { categoryLayoutApi } from '../../../../api/category-layout';
import { categoryLayoutItemApi } from '../../../../api/category-layout-item';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { CategoryLayoutItemCreateModal } from '../../../../sections/category-layout-item/category-layout-item-create-modal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CategoryLayoutItemCard } from '../../../../sections/category-layout-item/category-layout-item-card';
import { es } from 'date-fns/locale';

const useCategoryLayout = (categoryLayoutId) => {
  const isMounted = useMounted();
  const [categoryLayout, setCategoryLayout] = useState();

  const getCategoryLayout = useCallback(
    async (id) => {
      try {
        const response = await categoryLayoutApi.getCategoryLayout(id);

        if (isMounted()) {
          setCategoryLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getCategoryLayout(categoryLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryLayoutId],
  );

  return categoryLayout;
};

const CategoryItemsWrapper = styled(Box)(({ theme }) => ({
  '&.flex': {
    display: 'flex',
    flexWrap: 'wrap',

    '.category-item-card': {
      height: '250px',
      width: '25%',
    },
  },
  '&.grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: 250,

    '.category-item-card:first-child': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
      gridRowStart: 1,
      gridRowEnd: 3,
    },
    '.category-item-card:nth-child(2)': {
      gridColumnStart: 3,
      gridColumnEnd: 5,
    },
  },
}));

const languajesText = [
  {
    id: 1,
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    id: 2,
    name: 'Inglés',
    flag: '🇬🇧',
  },
  {
    id: 3,
    name: 'Francés',
    flag: '🇫🇷',
  },
  {
    id: 4,
    name: 'Portugués',
    flag: '🇵🇹',
  },
  {
    id: 5,
    name: 'Italiano',
    flag: '🇮🇹',
  },
  {
    id: 6,
    name: 'Alemán',
    flag: '🇩🇪',
  },
];

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const categoryLayout = useCategoryLayout(id);
  const [name, setName] = useState();
  const [categoryItems, setCategoryItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [type, setType] = useState('');

  const categoriesItemsByLanguage = useMemo(() => {
    const items = {};
    categoryItems.forEach((item) => {
      if (!items[item.language_id]) {
        items[item.language_id] = [];
      }

      items[item.language_id].push(item);
    });
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryItems]);

  usePageView();

  const typeOptions = ['flex', 'grid'];

  useEffect(() => {
    setName(categoryLayout?.name);
    setType(categoryLayout?.type || '');
  }, [categoryLayout]);

  const getCategoryItems = useCallback(() => {
    categoryLayoutItemApi
      .getCategoryLayoutItems({
        categoryId: id,
      })
      .then((res) => {
        setCategoryItems(res.items);
      });
  }, [id]);

  useEffect(() => {
    getCategoryItems();
  }, [id, getCategoryItems]);

  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  if (!categoryLayout) {
    return null;
  }

  const createdAt = format(
    new Date(categoryLayout.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await categoryLayoutApi.updateCategoryLayout(id, {
        name,
        type,
      });
      toast.success('Category actualizado correctamente');
      router.push(paths.adminContent.home.categories);
    } catch (error) {}
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      categoryItems,
      result.source.index,
      result.destination.index,
    );
    setCategoryItems(newItems);

    categoryLayoutItemApi.orderItems(newItems).then((res) => {
      getCategoryItems();
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
      const response = await categoryLayoutItemApi.createCategoryLayoutItem({
        order: categoryItems.length,
        order_mobile: categoryItems.length,
        source: data.source,
        id_category_layout: id,
        id_button: data.id_button,
        language_id: data.language_id,
      });
      getCategoryItems();
      setOpenCreateModal(false);
      toast.success('Category creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Diseño category # {categoryLayout.id} | PACOMARTINEZ</title>
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
                href={paths.adminContent.home.categories}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Diseño del category</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño de la categoría # {categoryLayout.id}
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
                    label="Nombre interno"
                    variant="filled"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <FormControl fullWidth>
                    <FormLabel
                      sx={{
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      Tipo
                    </FormLabel>
                    <Select
                      fullWidth
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {typeOptions.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  <Typography variant="h5">Items Categorías</Typography>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    onClick={openCreateDialog}
                  >
                    Crear Item
                  </Button>
                </Stack>

                {Object.keys(categoriesItemsByLanguage).map(
                  (languageId, index) => {
                    const categoryItems = categoriesItemsByLanguage[languageId];
                    return (
                      <Box key={index}>
                        <Typography
                          variant="h6"
                          sx={{
                            alignItems: 'center',
                            mb: 2,
                            textAlign: 'center',
                            width: '100%',
                          }}
                        >
                          {
                            languajesText.find((item) => item.id == languageId)
                              ?.flag
                          }{' '}
                          {languajesText.find((item) => item.id == languageId)
                            ?.name || 'Sin tienda'}
                        </Typography>
                        <CategoryItemsWrapper className={categoryLayout?.type}>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            {categoryItems.map((categoryItem, index) => (
                              <Droppable
                                droppableId={categoryItem.id.toString()}
                                type="task"
                                direction="horizontal"
                                key={index}
                              >
                                {(provided) => (
                                  <div
                                    key={categoryItem.id}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="category-item-card"
                                  >
                                    <CategoryLayoutItemCard
                                      categoryItem={categoryItem}
                                      index={index}
                                      refetch={getCategoryItems}
                                      onEdit={() =>
                                        openEditDialog(categoryItem)
                                      }
                                    />
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ))}
                          </DragDropContext>
                        </CategoryItemsWrapper>
                      </Box>
                    );
                  },
                )}
              </Stack>
            </div>
          </Stack>
          <CategoryLayoutItemCreateModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={onCreateItem}
            selectedItem={selectedItem}
            refetch={getCategoryItems}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
