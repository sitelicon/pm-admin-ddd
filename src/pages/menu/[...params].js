import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CardActions,
  Breadcrumbs,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { styled } from '@mui/material/styles';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { categoriesApi } from '../../api/categories';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';

const tenants = [
  { id: 1, label: '🇪🇸 Español' },
  { id: 2, label: '🇬🇧 Inglés' },
  { id: 3, label: '🇫🇷 Francés' },
  { id: 4, label: '🇵🇹 Portugués' },
  { id: 5, label: '🇮🇹 Italiano' },
  { id: 6, label: '🇩🇪 Alemán' },
  { id: 7, label: '🇵🇹 Madeira' },
];

const useProductImages = (productId, languajeId) => {
  const [state, setState] = useState({
    loading: true,
    images: [],
    error: undefined,
  });

  const getProductImages = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await categoriesApi.getImagesFromCategories(
        productId,
        languajeId,
      );
      setState((prevState) => ({
        ...prevState,
        loading: false,
        images: response,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error,
      }));
    }
  }, [productId, languajeId]);

  useEffect(
    () => {
      getProductImages();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId],
  );

  return {
    loading: state.loading,
    images: state.images,
    error: state.error,
    refetch: getProductImages,
  };
};

const ItemProductImageRendered = ({ image, refetch }) => {
  const [imageURL, setImageURL] = useState();
  const [file, setFile] = useState();
  const handleChangeImage = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageState, setImageState] = useState({
    src: image.src,
    title: image.title,
    alt: image.alt,
    order: image.order,
    path: image.path,
    language_id: image.language_id,
    category_id: image.category_id,
  });

  useEffect(
    () => {
      setImageState((prevState) => ({
        ...prevState,
        src: imageURL,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageURL],
  );

  const handleUpdateCategoryImage = async () => {
    try {
      setLoading(true);
      const obj = {
        category_id: imageState.category_id,
        title: imageState.title,
        alt: imageState.alt,
        order: imageState.order,
        path: imageState.path,
        language_id: imageState.language_id,
      };
      if (file) {
        obj.src = file;
      }
      await categoriesApi
        .updateImageFromCategory(image.id, obj)
        .then((res) => {
          setLoading(false);
          setError(false);
        })
        .finally(() => {
          refetch();
        });
    } catch (error) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          }}
        >
          <CardMedia
            component="img"
            image={imageURL ?? image.src}
            alt={image.title}
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
              top: 205,
              zIndex: 99,
              ml: 1,
            }}
          >
            {image.src ? 'Cambiar' : 'Añadir'}
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
            <TextField
              id="standard-basic"
              label="Título"
              value={imageState.title}
              onChange={(e) => {
                setImageState((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }}
            />
            <TextField
              id="standard-basic"
              label="Texto alternativo"
              value={imageState.alt}
              onChange={(e) => {
                setImageState((prevState) => ({
                  ...prevState,
                  alt: e.target.value,
                }));
              }}
            />
            <TextField
              id="standard-basic"
              label="Orden"
              value={imageState.order}
              type="number"
              onChange={(e) => {
                setImageState((prevState) => ({
                  ...prevState,
                  order: e.target.value,
                }));
              }}
              disabled
            />
            <TextField
              id="standard-basic"
              label="URL"
              value={imageState.path}
              onChange={(e) => {
                setImageState((prevState) => ({
                  ...prevState,
                  path: e.target.value,
                }));
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tienda</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={imageState.language_id}
                label="Tienda"
                onChange={(e) => {
                  setImageState((prevState) => ({
                    ...prevState,
                    language_id: e.target.value,
                  }));
                }}
                disabled
              >
                {tenants.map((tenant) => {
                  return (
                    <MenuItem key={tenant.id} value={tenant.id}>
                      {tenant.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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
        </CardActions>
      </Card>
    </Grid>
  );
};

const Page = () => {
  const router = useRouter();
  const { params } = router.query;
  const languajeId = useMemo(() => {
    switch (params[1]) {
      case '21':
        return 1;
      case '315':
        return 2;
      case '360':
        return 3;
      case '22':
        return 4;
      case '402':
        return 5;
      case '509':
        return 6;
      case '655':
        return 7;
      case '1141':
        return 7;
      default:
        return 1;
    }
  }, [params]);
  const { images, loading, error, refetch } = useProductImages(
    params[0],
    languajeId,
  );
  return (
    <>
      <Head>
        <title>Menu # {images[0]?.category_id} | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ marginBottom: 3 }}>
            <Stack direction={'column'}>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.menu.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Listado</Typography>
              </Link>
              <Box>
                <Typography variant="h5">Imágenes del menú</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.index}
                    variant="subtitle2"
                  >
                    Inicio
                  </Link>
                </Breadcrumbs>
              </Box>
            </Stack>
          </Box>
          <Grid container>
            {error && !images && (
              <Grid item xs={12}>
                <FormHelperText error>Se ha producido un error.</FormHelperText>
              </Grid>
            )}
            {loading && !images && (
              <Grid item xs={12}>
                <FormHelperText>Cargando...</FormHelperText>
              </Grid>
            )}
            {images.map((image, index) => {
              return (
                <ItemProductImageRendered
                  image={image}
                  key={index}
                  refetch={refetch}
                />
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
