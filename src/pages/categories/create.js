import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { toast } from 'react-hot-toast';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { categoriesApi } from '../../api/categories';
import { paths } from '../../paths';
import { useLanguageId } from '../../hooks/use-language-id';
import { useRouter } from 'next/router';
import { QuillEditor } from '../../components/quill-editor';
import { useStores } from '../../hooks/use-stores';
import { SeverityPill } from '../../components/severity-pill';

const revertCategory = (
  languageId,
  acc,
  category,
  parentNames = [],
  parentUrls = [],
) => {
  const data = category.data.find(
    ({ language_id }) => language_id === languageId,
  );
  const url =
    category.urls.find(({ language_id }) => language_id === languageId)?.url ||
    '';

  if (!data) {
    return acc;
  }

  return [
    ...acc,
    {
      label: [...parentNames, data.name].join(' → '),
      level: parentNames.length + 1,
      value: category.id,
      url: url,
      fullUrl: [...parentUrls, url].join('/'),
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(
          languageId,
          childAcc,
          children,
          [...parentNames, data.name],
          [...parentUrls, url],
        ),
      [],
    ),
  ];
};

const useCategories = () => {
  const languageId = useLanguageId();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = useMemo(
    () =>
      response.reduce(
        (acc, category) => revertCategory(languageId, acc, category),
        [],
      ),
    [response, languageId],
  );

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getCategories();
      setResponse(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return { categories, loading };
};

const CategoryCreatePage = () => {
  const router = useRouter();
  const languageId = useLanguageId();
  const defaultStores = useStores();
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [facebookSynced, setFacebookSynced] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [position, setPosition] = useState(0);
  const [metaTitles, setMetaTitles] = useState([]);
  const [metaDescriptions, setMetaDescriptions] = useState([]);
  const [urls, setUrls] = useState([]);
  const [stores, setStores] = useState([]);
  const { categories, loading: loadingCategories } = useCategories();

  useEffect(() => {
    if (parentId) {
      const parent = categories.find(
        ({ value }) => value.toString() === parentId.toString(),
      );
      if (parent) {
        setUrls((prev) => {
          return prev.map((url) => {
            if (url.language_id !== languageId) {
              return url;
            }
            const fullUrl = `${parent.fullUrl}/${url.value}`;
            return {
              ...url,
              full_url: fullUrl,
            };
          });
        });
      }
    }
  }, [parentId, categories, languageId]);

  const handleSave = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        const response = await categoriesApi.createCategory({
          names,
          descriptions,
          is_active: enabled ? 1 : 0,
          is_facebook_synced: facebookSynced ? 1 : 0,
          parent_id: parentId,
          position,
          level: parentId
            ? categories.find(
                ({ value }) => value.toString() === parentId.toString(),
              ).level + 1
            : 1,
          meta_titles: metaTitles,
          meta_descriptions: metaDescriptions,
          urls,
          stores: stores.map((id) => ({ id })),
        });
        toast.success('Categoría creada');
        if (response?.category?.id) {
          router.push(`/categories/${response.category.id}`);
        } else {
          router.push(paths.categories.index);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error al crear la categoría');
      } finally {
        setLoading(false);
      }
    },
    [
      router,
      enabled,
      facebookSynced,
      metaDescriptions,
      metaTitles,
      names,
      descriptions,
      parentId,
      position,
      urls,
      stores,
      categories,
    ],
  );

  const handleNameChange = useCallback(
    (event) => {
      const { value } = event.target;

      setNames((prev) => [
        ...prev.filter(({ language_id }) => language_id !== languageId),
        { language_id: languageId, value },
      ]);
    },
    [languageId],
  );

  const handleDescriptionChange = useCallback(
    (value) => {
      setDescriptions((prev) => [
        ...prev.filter(({ language_id }) => language_id !== languageId),
        { language_id: languageId, value },
      ]);
    },
    [languageId],
  );

  const handleMetaTitleChange = useCallback(
    (event) => {
      const { value } = event.target;

      setMetaTitles((prev) => [
        ...prev.filter(({ language_id }) => language_id !== languageId),
        { language_id: languageId, value },
      ]);
    },
    [languageId],
  );

  const handleMetaDescriptionChange = useCallback(
    (event) => {
      const { value } = event.target;

      setMetaDescriptions((prev) => [
        ...prev.filter(({ language_id }) => language_id !== languageId),
        { language_id: languageId, value },
      ]);
    },
    [languageId],
  );

  const handleUrlChange = useCallback(
    (event) => {
      const value = event.target.value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .trim()
        .toLowerCase();

      const fullUrl = parentId
        ? `${
            categories.find(
              ({ value }) => value.toString() === parentId.toString(),
            ).fullUrl
          }/${value}`
        : value;

      setUrls((prev) => [
        ...prev.filter(({ language_id }) => language_id !== languageId),
        { language_id: languageId, value, full_url: fullUrl },
      ]);
    },
    [languageId, parentId, categories],
  );

  // useEffect(() => {
  //   setUrls((prev) =>
  //     prev.map((url) => {
  //       const fullUrl = parentId
  //         ? `${
  //             categories.find(
  //               ({ value }) => value.toString() === parentId.toString(),
  //             ).fullUrl
  //           }/${url.value}`
  //         : url.value;

  //       return {
  //         ...url,
  //         full_url: fullUrl,
  //       };
  //     }),
  //   );
  // }, [languageId, parentId, categories]);

  const name = useMemo(
    () =>
      names.find(({ language_id }) => language_id === languageId)?.value || '',
    [languageId, names],
  );

  const description = useMemo(
    () =>
      descriptions.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    [languageId, descriptions],
  );

  const metaTitle = useMemo(
    () =>
      metaTitles.find(({ language_id }) => language_id === languageId)?.value ||
      '',
    [languageId, metaTitles],
  );

  const metaDescription = useMemo(
    () =>
      metaDescriptions.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    [languageId, metaDescriptions],
  );

  const url = useMemo(
    () =>
      urls.find(({ language_id }) => language_id === languageId)?.value || '',
    [languageId, urls],
  );

  return (
    <>
      <Head>
        <title>Crear categoría | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h5">
              Crear categoría{name.length > 0 ? `: ${name}` : ''}
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
                Crear categoría
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6">Información básica</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Puede cambiar el idioma de la tienda en la parte superior
                      derecha para agregar información en otros idiomas.
                    </Typography>
                  </Stack>
                  <Divider />
                </Stack>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  {/* <Grid item xs={12} md={6}>
                    <Typography gutterBottom variant="subtitle2">
                      Habilitar categoría
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Puedes habilitar o deshabilitar la categoría para que no
                      aparezca en la tienda.
                    </Typography>
                    <Switch
                      color="primary"
                      edge="start"
                      checked={enabled}
                      onChange={(event) => setEnabled(event.target.checked)}
                    />
                  </Grid> */}
                  <Grid item xs={12} md={6}>
                    <Typography gutterBottom variant="subtitle2">
                      Sincronizar con Facebook
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Puedes sincronizar el catálogo de productos con Facebook.
                    </Typography>
                    <Switch
                      color="primary"
                      edge="start"
                      checked={facebookSynced}
                      onChange={(event) =>
                        setFacebookSynced(event.target.checked)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      options={categories}
                      getOptionLabel={(option) => option.label}
                      disabled={loadingCategories}
                      value={
                        categories.find((c) => c.value === parentId) || null
                      }
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ fontSize: 14 }} {...props}>
                          {option.label}
                        </Box>
                      )}
                      onChange={(event, newValue) => {
                        setParentId(newValue?.value || 0);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Categoría padre"
                          helperText={
                            loadingCategories
                              ? 'Cargando las categorías…'
                              : 'La categoría padre es la que contiene a esta categoría. Si no seleccionas ninguna, la categoría será una categoría raíz.'
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="name"
                      helperText="Es el nombre de la categoría que se mostrará en la tienda."
                      value={name}
                      onChange={handleNameChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Posición"
                      name="position"
                      helperText="La posición es el orden en el que se mostrará la categoría en la tienda."
                      value={position}
                      onChange={(event) =>
                        setPosition(parseInt(event.target.value, 10))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="Visibilidad por tienda"
                subheader="Seleccione en qué tiendas desea que la categoría esté disponible."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
                action={
                  <Switch
                    color="success"
                    edge="start"
                    checked={defaultStores.some(({ id }) =>
                      stores.includes(id),
                    )}
                    onChange={(event) => {
                      setStores(
                        event.target.checked
                          ? defaultStores.map(({ id }) => id)
                          : [],
                      );
                    }}
                  />
                }
              />
              <Divider />
              <List>
                {defaultStores.map((store) => {
                  const isActive = stores.includes(store.id);
                  return (
                    <ListItem
                      key={store.id}
                      onClick={() =>
                        setStores((prev) =>
                          isActive
                            ? prev.filter((id) => id !== store.id)
                            : [...prev, store.id],
                        )
                      }
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <Checkbox checked={isActive} />
                      <ListItemText
                        disableTypography
                        primary={
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography
                              variant="body2"
                              color="text.primary"
                              fontStyle="bold"
                            >
                              Tienda en {store.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontSize={12}
                            >
                              {store.code.toUpperCase()}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Typography
                        color="text.secondary"
                        sx={{ whiteSpace: 'nowrap' }}
                        variant="caption"
                      >
                        <SeverityPill color={isActive ? 'success' : 'warning'}>
                          {isActive ? 'Habilitado' : 'Deshabilitado'}
                        </SeverityPill>
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6">
                      SEO (Motores de búsqueda)
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Puede cambiar el idioma de la tienda en la parte superior
                      derecha para agregar información en otros idiomas.
                    </Typography>
                  </Stack>
                  <Divider />
                </Stack>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Enlace URL"
                      name="url_key"
                      helperText="El enlace URL es una versión amigable de la categoría. Debe ser único en la plataforma y no puede contener espacios. Ejemplo: categorias-de-productos"
                      value={url}
                      onChange={handleUrlChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Título SEO"
                      name="meta_title"
                      helperText="El título SEO es el título que se mostrará en los motores de búsqueda."
                      value={metaTitle}
                      onChange={handleMetaTitleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Descripción SEO"
                      name="meta_description"
                      helperText="La descripción SEO es la descripción que se mostrará en los motores de búsqueda."
                      value={metaDescription}
                      onChange={handleMetaDescriptionChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6">
                      Descripción (SEO ON PAGE)
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Puede cambiar el idioma de la tienda en la parte superior
                      derecha para agregar información en otros idiomas.
                    </Typography>
                  </Stack>
                  <Divider />
                </Stack>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <QuillEditor
                      onChange={(value, _, source) => {
                        if (source !== 'user') return;
                        handleDescriptionChange(value);
                      }}
                      placeholder="Escriba la descripción SEO ON PAGE de la categoría…"
                      sx={{ height: 400 }}
                      value={description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                color="primary"
                variant="contained"
                disabled={loading}
                onClick={handleSave}
              >
                {loading ? 'Creando categoría…' : 'Crear categoría'}
              </Button>
              <Button
                LinkComponent={NextLink}
                href={paths.categories.index}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CategoryCreatePage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CategoryCreatePage;
