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
import { sliderLayoutApi } from '../../../../api/slider-layout';
import { sliderLayoutItemApi } from '../../../../api/slider-layout-item';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { SliderLayoutItemCreateModal } from '../../../../sections/slider-layout-item/slider-layout-item-create-modal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { SliderLayoutItemCard } from '../../../../sections/slider-layout-item/slider-layout-item-card';
import { es } from 'date-fns/locale';

const useSliderLayout = (sliderLayoutId) => {
  const isMounted = useMounted();
  const [sliderLayout, setSliderLayout] = useState();

  const getSliderLayout = useCallback(
    async (id) => {
      try {
        const response = await sliderLayoutApi.getSliderLayout(id);

        if (isMounted()) {
          setSliderLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getSliderLayout(sliderLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sliderLayoutId],
  );

  return sliderLayout;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const sliderLayout = useSliderLayout(id);
  const [name, setName] = useState();
  const [sliderItems, setSliderItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  usePageView();

  useEffect(() => {
    setName(sliderLayout?.name);
  }, [sliderLayout]);

  useEffect(() => {
    getSliderItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getSliderItems = () => {
    sliderLayoutItemApi
      .getSliderLayoutItems({
        sliderId: id,
      })
      .then((res) => {
        setSliderItems(res.items);
      });
  };

  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  if (!sliderLayout) {
    return null;
  }

  const createdAt = format(
    new Date(sliderLayout.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await sliderLayoutApi.updateSliderLayout(id, {
        name,
      });
      toast.success('Slider actualizado correctamente');
      router.push(paths.adminContent.home.sliders);
    } catch (error) {}
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      sliderItems,
      result.source.index,
      result.destination.index,
    );
    setSliderItems(newItems);

    sliderLayoutItemApi.orderItems(newItems).then((res) => {
      getSliderItems();
    });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onCreateItem = async (data) => {
    try {
      await sliderLayoutItemApi.createSliderLayoutItem({
        order: sliderItems.length,
        ...data,
        id_slider_layout: id,
      });
      getSliderItems();
      setOpenCreateModal(false);
      toast.success('Slider creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Diseño slider # {sliderLayout.id} | PACOMARTINEZ</title>
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
                href={paths.adminContent.home.sliders}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Diseño del slider</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del slider # {sliderLayout.id}
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                  <Typography variant="h5">Slider items</Typography>
                  <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    onClick={openCreateDialog}
                  >
                    Crear slider item
                  </Button>
                </Stack>

                <DragDropContext onDragEnd={handleDragEnd}>
                  {sliderItems.map((sliderItem, index) => (
                    <Droppable
                      droppableId={sliderItem.id.toString()}
                      type="task"
                      key={index}
                    >
                      {(provided) => (
                        <div
                          key={sliderItem.id}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <SliderLayoutItemCard
                            sliderItem={sliderItem}
                            index={index}
                            refetch={getSliderItems}
                            onEdit={() => openEditDialog(sliderItem)}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </DragDropContext>
              </Stack>
            </div>
          </Stack>
          <SliderLayoutItemCreateModal
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={onCreateItem}
            selectedItem={selectedItem}
            refetch={getSliderItems}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
