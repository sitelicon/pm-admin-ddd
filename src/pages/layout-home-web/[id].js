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
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { layoutHomeWebApi } from '../../api/layout-home-web';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';
import { apiRequest } from '../../utils/api-request';
import { BannerItemLanguageCard } from '../../sections/banner-text-layout-item/banner-item-language-card';

const useLayoutHomeWeb = (layoutHomeWebId) => {
  const isMounted = useMounted();
  const [layoutHomeWeb, setLayoutHomeWeb] = useState();

  const getLayoutHomeWeb = useCallback(
    async (id) => {
      try {
        const response = await layoutHomeWebApi.getLayoutHomeWeb(id);

        if (isMounted()) {
          setLayoutHomeWeb(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getLayoutHomeWeb(layoutHomeWebId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutHomeWebId],
  );

  return layoutHomeWeb;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const layoutHomeWeb = useLayoutHomeWeb(id);
  const [objectId, setObjectId] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState();
  const [objectType, setObjectType] = useState('');

  const [items, setItems] = useState([]);

  const getItems = async (type) => {
    const res = await apiRequest(`admin/${type}`, {
      method: 'GET',
    });
    setItems(res.items);
  };

  useEffect(() => {
    if (objectType) {
      getItems(objectType);
    }
  }, [objectType]);

  const objectTypes = [
    'slider_layout',
    'banner_text_layout',
    'banner_images_layout',
    'category_layout',
    'blog_layout',
    'instagram_layout',
    'mid_banner',
  ];

  usePageView();

  useEffect(() => {
    if (layoutHomeWeb) {
      setPosition(layoutHomeWeb?.layout?.position ?? layoutHomeWeb.position);
      setObjectId(layoutHomeWeb?.layout?.object_id ?? layoutHomeWeb.object_id);
      setObjectType(
        layoutHomeWeb?.layout?.object_type ?? layoutHomeWeb.object_type,
      );
      setIsActive(layoutHomeWeb?.layout?.is_active ?? layoutHomeWeb.is_active);
    }
  }, [layoutHomeWeb]);

  if (!layoutHomeWeb) {
    return null;
  }

  const createdAt = format(
    new Date(layoutHomeWeb.layout?.created_at ?? layoutHomeWeb.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await layoutHomeWebApi.updateLayoutHomeWeb(id, {
        position,
        is_active: isActive,
        object_id: objectId,
        object_type: objectType,
      });
      toast.success('Maquetación Web creado correctamente');
      setError(undefined);
      router.push(`/layout-home-web`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>
          Maquetación Web # {layoutHomeWeb.layout?.id || layoutHomeWeb.id} |
          PACOMARTINEZ
        </title>
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
                component={Button}
                // href={paths.layoutHomeWeb.index}
                onClick={() => {
                  router.back();
                }}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Maquetación Web</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Maquetación Web #{' '}
                  {layoutHomeWeb.layout?.id || layoutHomeWeb.id}
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
                    label="Posición"
                    type="number"
                    variant="filled"
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
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
                      Tipo de objeto
                    </FormLabel>
                    <Select
                      fullWidth
                      value={objectType || ''}
                      onChange={(e) => setObjectType(e.target.value)}
                    >
                      {objectTypes.map((item, index) => (
                        <MenuItem key={item} value={item}>
                          {item}
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
                      Nombre interno
                    </FormLabel>
                    <Select
                      fullWidth
                      disabled={!objectType}
                      value={objectId}
                      onChange={(e) => setObjectId(e.target.value)}
                    >
                      {items.map((item, index) => (
                        <MenuItem key={`${item}-${index}`} value={item.id}>
                          {item.name ?? item.title_admin}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(event, checked) => setIsActive(checked)}
                      />
                    }
                    label={isActive ? 'Visible' : 'Inactivo'}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="large" variant="contained" type="submit">
                      Actualizar
                    </Button>
                  </Box>
                </form>

                {layoutHomeWeb.infoRelationated &&
                  layoutHomeWeb.infoRelationated.languages?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h5" className="pb-3">
                        Contenido
                      </Typography>
                      <Grid container spacing={2}>
                        {layoutHomeWeb.infoRelationated.languages.map(
                          (item, index) => {
                            switch (layoutHomeWeb.infoRelationated.type) {
                              case 'banner_text_layout':
                                return (
                                  <BannerItemLanguageCard
                                    id={item.id}
                                    bannerLang={item}
                                    isVisually
                                  />
                                );
                              default:
                                return null;
                            }
                          },
                        )}
                      </Grid>
                    </Box>
                  )}
                {layoutHomeWeb.infoRelationated &&
                  layoutHomeWeb.infoRelationated.items?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h5" className="pb-2">
                        Contenido
                      </Typography>
                      <Grid
                        container
                        spacing={{
                          xs: 3,
                          lg: 4,
                        }}
                      >
                        {layoutHomeWeb.infoRelationated.items.map(
                          (item, index) => {
                            switch (layoutHomeWeb.infoRelationated.type) {
                              case 'category_layout':
                                return (
                                  <Grid
                                    item
                                    xs={3}
                                    key={index}
                                    sx={{ position: 'relative' }}
                                  >
                                    <img
                                      src={item.source}
                                      width={'100%'}
                                      height={'100%'}
                                      style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        bottom: 20,
                                        transform: 'translateX(-50%)',
                                      }}
                                    >
                                      {item.button?.type === 'button' && (
                                        <button
                                          type="button"
                                          href={item.button?.url}
                                        >
                                          {item.button?.title}
                                        </button>
                                      )}
                                      {item.button?.type === 'link' && (
                                        <a href={item.button?.url}>
                                          {item.button?.title}
                                        </a>
                                      )}
                                    </Box>
                                  </Grid>
                                );
                              case 'banner_images_layout':
                                return (
                                  <Box sx={{ display: 'flex' }} gap={2}>
                                    <img
                                      src={item.source}
                                      style={{ height: 200 }}
                                    />

                                    <Box>
                                      <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{ textAlign: 'center' }}
                                      >
                                        {item.title}
                                      </Typography>

                                      <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                          <u>Información del botón</u>
                                        </Typography>
                                        <Typography gutterBottom>
                                          <strong>Titulo:</strong>{' '}
                                          {item.button?.title}
                                        </Typography>
                                        <Typography gutterBottom>
                                          <strong>URL:</strong>{' '}
                                          {item.button?.url}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                );
                              default:
                                return null;
                            }
                          },
                        )}
                      </Grid>
                    </Box>
                  )}
              </Stack>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
