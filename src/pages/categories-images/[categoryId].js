import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { categoriesApi } from '../../api/categories';
import { CategoriesImagesCreateModal } from '../../sections/categories-images/cat-images-create-modal';
import { buttonApi } from '../../api/button';
import { storesApi } from '../../api/stores';
import toast from 'react-hot-toast';

const useButtons = (search) => {
  const [state, setState] = useState({
    buttons: [],
    buttonsCount: 0,
    loading: true,
  });

  const getButtons = useCallback(async () => {
    try {
      const response = await buttonApi.getButtons({
        allOption: true,
      });

      setState({
        buttons: response.items,
        buttonsCount: response.pagination.totalItems,
        loading: false,
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      console.error(err);
    }
  }, []);

  useEffect(
    () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      getButtons();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    buttons: state.buttons,
    buttonsCount: state.buttonsCount,
    loading: state.loading,
    getButtons,
  };
};

const useStore = () => {
  const [state, setState] = useState({
    stores: [],
    loadingStores: true,
  });

  const getStores = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingStores: true,
      }));

      const res = await storesApi.getStores();

      setState({
        stores: res,
        loadingStores: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingStores: false,
      }));
    }
  };

  useEffect(() => {
    getStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

const useCategory = (categoryId) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  const fetchCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await categoriesApi.getCategory(id);
      setCategory(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [fetchCategory, categoryId]);

  return {
    category,
    error,
    refetch: () => fetchCategory(categoryId),
    loading,
  };
};

const useCategoryImage = (categoryId) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  const fetchCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await categoriesApi.getImagesByCategoryId(id);
      setCategory(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [fetchCategory, categoryId]);

  return {
    categoryImage: category,
    errorCategory: error,
    refetch: () => fetchCategory(categoryId),
    loading,
  };
};

const ItemImageRendered = ({ item, refetch }) => {
  const { stores } = useStore();
  const { buttons } = useButtons();
  const [imageURL, setImageURL] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageState, setImageState] = useState({
    image: item.url,
    button_id: item.button_id,
    category_id: item.category_id,
    store_id: item.store_id,
    display_order: item.display_order,
    tag: item.tag,
  });

  useEffect(
    () => {
      setImageState((prevState) => ({
        ...prevState,
        image: imageURL ?? item.url,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageURL],
  );

  const handleChangeImage = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdateCategoryImage = async () => {
    try {
      setLoading(true);
      const obj = {
        image: imageState.image,
        button_id: parseInt(imageState.button_id),
        category_id: parseInt(imageState.category_id),
        store_id: parseInt(imageState.store_id),
        display_order: imageState.display_order,
        tag: imageState.tag,
      };
      if (file) {
        obj.image = file;
      }
      await categoriesApi.updateCategoryImage(item.id, obj).then((res) => {
        setLoading(false);
        setError(false);
        setImageURL(res.url);
        toast.success('Imagen actualizada correctamente');
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
      toast.error('Se ha producido un error al actualizar la imagen');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleDeleteCategoryImage = async () => {
    try {
      setLoading(true);
      await categoriesApi.deleteImageCategory(item.id).then((res) => {
        setLoading(false);
        setError(false);
      });
      refetch();
    } catch (error) {
      setError(true);
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={4}
      sx={{
        padding: 1,
      }}
    >
      <Card sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
          }}
        >
          <CardMedia
            component="img"
            image={imageURL ?? item.url}
            sx={{
              position: 'relative',
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
            height="100%"
          />
          <Button
            component="label"
            variant="contained"
            sx={{
              position: 'absolute',
              top: 20,
              zIndex: 99,
              ml: 1,
            }}
          >
            {item.url ? 'Cambiar' : 'Añadir'}
            <input
              style={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              type="file"
              name="[src]"
              onChange={handleChangeImage}
            />
          </Button>
        </Box>
        <CardContent>
          <Stack direction={'column'} gap={2}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Tienda
              </FormLabel>
              <Select
                fullWidth
                value={imageState.store_id}
                onChange={(e) =>
                  setImageState({ ...imageState, store_id: e.target.value })
                }
              >
                {stores.map((item, index) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Botón
              </FormLabel>
              <Select
                fullWidth
                value={imageState.button_id}
                onChange={(e) =>
                  setImageState({ ...imageState, button_id: e.target.value })
                }
              >
                {buttons.map((item, index) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title} - {item.url}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              error={!!error}
              fullWidth
              label="Orden de visualización"
              margin="normal"
              variant="filled"
              value={imageState.display_order}
              multiline
              onChange={(event) =>
                setImageState({
                  ...imageState,
                  display_order: event.target.value,
                })
              }
              helperText={error || 'El orden es obligatorio'}
              required
            />
            <TextField
              error={!!error}
              fullWidth
              label="Titulo de la imagen"
              margin="normal"
              variant="filled"
              value={imageState.tag}
              multiline
              onChange={(event) =>
                setImageState({
                  ...imageState,
                  tag: event.target.value,
                })
              }
              helperText={error || 'El título es obligatorio'}
              required
            />
          </Stack>
          {error && (
            <Typography color="error" variant="body2">
              Se ha producido un error al actualizar la imagen.
            </Typography>
          )}
        </CardContent>
        <CardActions
          sx={{
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            onClick={handleUpdateCategoryImage}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button
            sx={{ width: '100%' }}
            variant="outlined"
            onClick={handleDeleteCategoryImage}
          >
            Eliminar
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

const CategoryImagesEditPage = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const router = useRouter();
  const { categoryId } = router.query;
  const { category, error } = useCategory(categoryId);
  const { categoryImage, loading, errorCategory, refetch } =
    useCategoryImage(categoryId);

  if (loading) {
    return null;
  }

  if (error && !category) {
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">{error}</Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>
          Edición imágenes categorías {category?.data[0].name} | PACOMARTINEZ
        </title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="end"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h5">
                  Listado de imágenes {category?.data[0].name}
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.index}
                    variant="subtitle2"
                  >
                    Inicio
                  </Link>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.categories.index}
                    variant="subtitle2"
                  >
                    Categorías
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Editar imágenes de categoría
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Añadir imagen
                </Button>
                <CategoriesImagesCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  categoryId={categoryId}
                  refresh={refetch}
                />
              </Stack>
            </Stack>
          </Box>
          <Stack spacing={3}>
            {errorCategory &&
            errorCategory == 'No images found for this category' ? (
              <Typography color="text.secondary">
                No hay imágenes para esta categoría.
              </Typography>
            ) : (
              <Grid spacing={2} container>
                {categoryImage?.map((image, index) => {
                  return (
                    <ItemImageRendered
                      item={image}
                      key={index}
                      refetch={refetch}
                    />
                  );
                })}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CategoryImagesEditPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CategoryImagesEditPage;
