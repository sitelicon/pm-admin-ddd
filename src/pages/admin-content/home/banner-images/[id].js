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
} from '@mui/material';
import { bannerImageLayoutApi } from '../../../../api/banner-image-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { bannerImageLayoutItemApi } from '../../../../api/banner-image-layout-item';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { BannerImageLayoutItemCard } from '../../../../sections/banner-image-layout-item/banner-image-layout-item-card';
import { BannerImageLayoutItemCreateModal } from '../../../../sections/banner-image-layout-item/banner-image-layout-item-create-modal';

const useBannerImageLayout = (bannerImageLayoutId) => {
  const isMounted = useMounted();
  const [bannerImageLayout, setBannerImageLayout] = useState();

  const getBannerImageLayout = useCallback(
    async (id) => {
      try {
        const response = await bannerImageLayoutApi.getBannerImageLayout(id);

        if (isMounted()) {
          setBannerImageLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getBannerImageLayout(bannerImageLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bannerImageLayoutId],
  );

  return bannerImageLayout;
};

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
  {
    id: 7,
    name: 'Portugués - Madeira',
    flag: '🇵🇹',
  },
];

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const bannerImageLayout = useBannerImageLayout(id);
  const [name, setName] = useState();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('single');
  const [bannerImageItems, setBannerImageItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const bannerImageItemByLanguage = useMemo(
    () => {
      return bannerImageItems.reduce((acc, bannerImageItem) => {
        const { language_id } = bannerImageItem;
        const items = acc[language_id] || [];
        items.push(bannerImageItem);
        acc[language_id] = items;
        return acc;
      }, {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bannerImageItems],
  );

  usePageView();

  useEffect(() => {
    setName(bannerImageLayout?.name);
    setTitle(bannerImageLayout?.title);
    setSubtitle(bannerImageLayout?.subtitle);
    setType(bannerImageLayout?.type || '');
  }, [bannerImageLayout]);

  const getBannerImageItems = useCallback(() => {
    bannerImageLayoutItemApi
      .getBannerImageLayoutItems({
        bannerImageLayoutId: id,
      })
      .then((res) => {
        setBannerImageItems(res.items);
      });
  }, [id]);

  useEffect(() => {
    getBannerImageItems();
  }, [id, getBannerImageItems]);

  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      bannerImageItems,
      result.source.index,
      result.destination.index,
    );
    setBannerImageItems(newItems);

    bannerImageLayoutItemApi.orderItems(newItems).then((res) => {
      getBannerImageItems();
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
      const response =
        await bannerImageLayoutItemApi.createBannerImageLayoutItem({
          order: bannerImageItems.length,
          source: data.source,
          id_banner_images_layout: id,
          title: data.title,
          id_button: data.id_button,
          language_id: data.language_id,
        });
      getBannerImageItems();
      setOpenCreateModal(false);
      toast.success('Banner Image Item creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  if (!bannerImageLayout) {
    return null;
  }

  const createdAt = format(
    new Date(bannerImageLayout.created_at),
    'dd/MM/yyyy HH:mm',
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await bannerImageLayoutApi.updateBannerImageLayout(id, {
        name,
      });
      toast.success('Banner actualizado correctamente');
      router.push(paths.adminContent.home.bannerImages);
    } catch (error) {}
  };

  const typeOptions = ['single', 'double'];

  return (
    <>
      <Head>
        <title>Diseño banner # {bannerImageLayout.id} | PACOMARTINEZ</title>
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
                href={paths.adminContent.home.bannerImages}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Diseño del banner</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del banner # {bannerImageLayout.id}
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
                        <MenuItem key={item} value={item}>
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
              </Stack>

              <Stack
                justifyContent="space-between"
                alignItems="center"
                direction="row"
                sx={{ py: 3 }}
              >
                <Typography variant="h5">Banner Imágenes - Items</Typography>
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  onClick={openCreateDialog}
                >
                  Crear Item
                </Button>
              </Stack>

              {Object.keys(bannerImageItemByLanguage).map(
                (languageId, index) => {
                  const bannerImageItemsByLanguage =
                    bannerImageItemByLanguage[languageId];
                  return (
                    <Box key={index} sx={{ pb: 2 }}>
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
                      <DragDropContext onDragEnd={handleDragEnd}>
                        {bannerImageItemsByLanguage.map(
                          (bannerImageItem, index) => (
                            <Droppable
                              droppableId={bannerImageItem.id.toString()}
                              type="task"
                              key={index}
                            >
                              {(provided) => (
                                <div
                                  key={bannerImageItem.id}
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <BannerImageLayoutItemCard
                                    bannerImageItem={bannerImageItem}
                                    index={index}
                                    refetch={getBannerImageItems}
                                    onEdit={() =>
                                      openEditDialog(bannerImageItem)
                                    }
                                  />
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          ),
                        )}
                      </DragDropContext>
                    </Box>
                  );
                },
              )}
            </div>

            {/* //   <DragDropContext onDragEnd={handleDragEnd}>
            //     {bannerImageItems.map((bannerImageItem, index) => (
            //       <Droppable
            //         droppableId={bannerImageItem.id.toString()}
            //         type="task"
            //         key={index}
            //       >
            //         {(provided) => (
            //           <div
            //             key={bannerImageItem.id}
            //             ref={provided.innerRef}
            //             {...provided.droppableProps}
            //           >
            //             <BannerImageLayoutItemCard
            //               bannerImageItem={bannerImageItem}
            //               index={index}
            //               refetch={getBannerImageItems}
            //               onEdit={() => openEditDialog(bannerImageItem)}
            //             />
            //             {provided.placeholder}
            //           </div>
            //         )}
            //       </Droppable>
            //     ))}
            //   </DragDropContext>
            // </div> */}
            <BannerImageLayoutItemCreateModal
              open={openCreateModal}
              onClose={() => setOpenCreateModal(false)}
              onCreate={onCreateItem}
              selectedItem={selectedItem}
              refetch={getBannerImageItems}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
