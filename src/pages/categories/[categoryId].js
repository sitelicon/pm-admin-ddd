import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
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
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { categoriesApi } from '../../api/categories';
import { CategoryProducts } from '../../sections/category/category-products';
import { useLanguageId } from '../../hooks/use-language-id';
import { FileDropzone } from '../../components/file-dropzone';
import { QuillEditor } from '../../components/quill-editor';
import { useStores } from '../../hooks/use-stores';
import { SeverityPill } from '../../components/severity-pill';
import { useAuth } from '../../hooks/use-auth';

const revertCategory = (
  languageId,
  acc,
  category,
  excludeId,
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
      excluded: category.id === parseInt(excludeId, 10),
      label: [...parentNames, data.name].join(' → '),
      level: parentNames.length + 1,
      value: category.id,
      fullUrl: [...parentUrls, url].join('/'),
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(
          languageId,
          childAcc,
          children,
          excludeId,
          [...parentNames, data.name],
          [...parentUrls, url],
        ),
      [],
    ),
  ];
};

const useCategories = (categoryId) => {
  const languageId = useLanguageId();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = useMemo(
    () =>
      response.reduce(
        (acc, category) =>
          revertCategory(languageId, acc, category, categoryId),
        [],
      ),
    [response, categoryId, languageId],
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

const CategoryEditPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const languageId = useLanguageId();
  const defaultStores = useStores();
  const { categoryId } = router.query;
  const { categories, loading: loadingCategories } = useCategories(categoryId);
  const { category, loading, error, refetch } = useCategory(categoryId);
  const [updating, setUpdating] = useState(false);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [facebookSynced, setFacebookSynced] = useState(false);
  const [isTravel, setIsTravel] = useState(false);
  const [urls, setUrls] = useState([]);
  const [stores, setStores] = useState([]);
  const [parentId, setParentId] = useState(0);
  const [erpId, setErpId] = useState('');
  const [isDiscountCategory, setIsDiscountCategory] = useState([]);
  const [position, setPosition] = useState(0);
  const [textMenuColor, setTextMenuColor] = useState(null);
  const [metaTitles, setMetaTitles] = useState([]);
  const [metaDescriptions, setMetaDescriptions] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFilesDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles[0] ? [acceptedFiles[0]] : []);
  }, []);

  const handleFileRemove = useCallback(() => {
    setFiles([]);
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleFilesUpload = useCallback(async () => {}, []);

  useEffect(() => {
    if (category) {
      setNames(
        category.data.map(({ language_id, name }) => ({
          language_id,
          value: name,
        })),
      );
      setDescriptions(
        category.data.map(({ language_id, description }) => ({
          language_id,
          value: description,
        })),
      );
      setEnabled(category.is_active);
      setFacebookSynced(category.is_facebook_synced);
      setIsTravel(category.is_travel);
      setUrls(
        category.urls.map(({ language_id, url, full_url }) => ({
          language_id,
          value: url,
          full_url,
        })),
      );
      setParentId(category.parent_id);
      setErpId(category.erp_id || '');
      setIsDiscountCategory(
        category.data.map(({ language_id, is_category_discount }) => ({
          language_id,
          value: is_category_discount,
        })),
      );
      setPosition(category.position);
      setTextMenuColor(category.text_menu_color);
      setMetaTitles(
        category.data.map(({ language_id, meta_title }) => ({
          language_id,
          value: meta_title,
        })),
      );
      setMetaDescriptions(
        category.data.map(({ language_id, meta_description }) => ({
          language_id,
          value: meta_description,
        })),
      );
      setStores(category.stores.map(({ id }) => id));
    }
  }, [category]);

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

  const handleUpdate = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdating(true);
        await categoriesApi.updateCategory(categoryId, {
          names,
          descriptions,
          is_active: enabled ? 1 : 0,
          is_facebook_synced: facebookSynced ? 1 : 0,
          is_travel: isTravel ? 1 : 0,
          parent_id: parentId,
          erp_id: erpId.trim().length > 0 ? erpId : undefined,
          is_discount_category: isDiscountCategory ? 1 : 0,
          position,
          text_menu_color: textMenuColor,
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
        toast.success('Categoría actualizada');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar la categoría');
      } finally {
        setUpdating(false);
      }
    },
    [
      categoryId,
      names,
      descriptions,
      enabled,
      facebookSynced,
      isTravel,
      parentId,
      erpId,
      isDiscountCategory,
      position,
      textMenuColor,
      metaTitles,
      metaDescriptions,
      urls,
      stores,
      categories,
      refetch,
    ],
  );

  const handleNameChange = useCallback(
    (event) => {
      const { value } = event.target;
      setNames((prev) => {
        const name = prev.find(({ language_id }) => language_id === languageId);
        if (!name) {
          return [...prev, { language_id: languageId, value }];
        }
        return prev.map((name) =>
          name.language_id === languageId ? { ...name, value } : name,
        );
      });
    },
    [languageId],
  );

  const handleDescriptionChange = useCallback(
    (value) => {
      setDescriptions((prev) => {
        const target = prev.find(
          ({ language_id }) => language_id === languageId,
        );
        if (!target) {
          return [...prev, { language_id: languageId, value }];
        }
        return prev.map((item) =>
          item.language_id === languageId ? { ...item, value } : item,
        );
      });
    },
    [languageId],
  );

  const handleMetaTitleChange = useCallback(
    (event) => {
      const { value } = event.target;
      setMetaTitles((prev) => {
        const metaTitle = prev.find(
          ({ language_id }) => language_id === languageId,
        );
        if (!metaTitle) {
          return [...prev, { language_id: languageId, value }];
        }
        return prev.map((metaTitle) =>
          metaTitle.language_id === languageId
            ? { ...metaTitle, value }
            : metaTitle,
        );
      });
    },
    [languageId],
  );

  const handleIsCategoryDiscountChange = useCallback(
    (event) => {
      const { value } = event.target;
      setIsDiscountCategory((prev) => {
        const isDiscountCategory = prev.find(
          ({ language_id }) => language_id === languageId,
        );
        if (!isDiscountCategory) {
          return [...prev, { language_id: languageId, value }];
        }
        return prev.map((isDiscountCategory) =>
          isDiscountCategory.language_id === languageId
            ? { ...isDiscountCategory, value }
            : isDiscountCategory,
        );
      });
    },
    [languageId],
  );

  const handleMetaDescriptionChange = useCallback(
    (event) => {
      const { value } = event.target;
      setMetaDescriptions((prev) => {
        const metaDescription = prev.find(
          ({ language_id }) => language_id === languageId,
        );
        if (!metaDescription) {
          return [...prev, { language_id: languageId, value }];
        }
        return prev.map((metaDescription) =>
          metaDescription.language_id === languageId
            ? { ...metaDescription, value }
            : metaDescription,
        );
      });
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

      setUrls((prev) => {
        const url = prev.find(({ language_id }) => language_id === languageId);
        if (!url) {
          return [
            ...prev,
            { language_id: languageId, value, full_url: fullUrl },
          ];
        }
        return prev.map((url) =>
          url.language_id === languageId
            ? { ...url, value, full_url: fullUrl }
            : url,
        );
      });
    },
    [languageId, parentId, categories],
  );

  // useEffect(() => {
  //   setUrls((prev) =>
  //     prev.map((url) => {
  //       const fullUrl =
  //         parentId && categories.length > 0
  //           ? `${
  //               categories.find(
  //                 ({ value }) => value.toString() === parentId.toString(),
  //               ).fullUrl
  //             }/${url.value}`
  //           : url.value;

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
    [names, languageId],
  );

  const description = useMemo(
    () =>
      descriptions.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    [descriptions, languageId],
  );

  const url = useMemo(
    () =>
      urls.find(({ language_id }) => language_id === languageId)?.value || '',
    [urls, languageId],
  );

  const metaTitle = useMemo(
    () =>
      metaTitles.find(({ language_id }) => language_id === languageId)?.value ||
      '',
    [metaTitles, languageId],
  );

  const metaDescription = useMemo(
    () =>
      metaDescriptions.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    [metaDescriptions, languageId],
  );

  const isCategoryDiscount = useMemo(
    () =>
      isDiscountCategory.find(({ language_id }) => language_id === languageId)
        ?.value || false,
    [isDiscountCategory, languageId],
  );

  if (loading) {
    return null;
  }

  if (error || !category) {
    return (
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">Categoría no encontrada</Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>
          {name} (ID: {category.id}) | Listado de categorías | PACOMARTINEZ
        </title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h5">Categoría: {name}</Typography>
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
                Editar categoría
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
                <Grid container spacing={2} sx={{ mt: 2 }}>
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
                    <Autocomplete
                      fullWidth
                      disablePortal
                      options={categories.filter(({ excluded }) => !excluded)}
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
                      label="ERP ID"
                      name="erp_id"
                      helperText="El ID de ERP es el identificador de la categoría en el sistema de gestión."
                      value={erpId}
                      onChange={(event) => setErpId(event.target.value)}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Es categoría de descuentos"
                        checked={isCategoryDiscount}
                        onChange={handleIsCategoryDiscountChange}
                      />
                      <FormHelperText>
                        Si la categoría es una categoría de rebajas, se mostrará
                        el filtro de búsqueda de precios especiales.
                      </FormHelperText>
                    </FormControl>
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
                    <TextField
                      fullWidth
                      type="text"
                      label="Color del texto"
                      name="position"
                      helperText="El color del texto que aparece en el menú. Este valor debe ser un color hexadecimal."
                      value={textMenuColor}
                      onChange={(event) => setTextMenuColor(event.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {/* <Card>
                    <CardContent>
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
                    </CardContent>
                  </Card> */}
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
                              <SeverityPill
                                color={isActive ? 'success' : 'warning'}
                              >
                                {isActive ? 'Habilitado' : 'Deshabilitado'}
                              </SeverityPill>
                            </Typography>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="subtitle2">
                          Sincronizar con Facebook
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          Puedes sincronizar el catálogo de productos con la
                          página de Facebook.
                        </Typography>
                        <Switch
                          color="primary"
                          edge="start"
                          checked={facebookSynced}
                          onChange={(event) =>
                            setFacebookSynced(event.target.checked)
                          }
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant="subtitle2">
                          ¿Es una categoría de viajes?
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          Puedes habilitar esta opción si los productos de la
                          categoría se mostrarán agrupados.
                        </Typography>
                        <Switch
                          color="primary"
                          edge="start"
                          checked={isTravel}
                          onChange={(event) =>
                            setIsTravel(event.target.checked)
                          }
                        />
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {category.parent?.children_has_images && (
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack spacing={0.5}>
                      <Typography variant="h6">Imagen</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Selecciona una imagen para la categoría.
                      </Typography>
                    </Stack>
                    <Divider />
                    {!category.image_url && (
                      <FileDropzone
                        accept={{ 'image/*': [] }}
                        caption="(SVG, JPG, PNG, o GIF)"
                        files={files}
                        onDrop={handleFilesDrop}
                        onRemove={handleFileRemove}
                        onRemoveAll={handleFilesRemoveAll}
                        onUpload={handleFilesUpload}
                        uploading={uploadingFiles}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
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
                      id="descriptionSEO"
                      className="descriptionSEO"
                      value={description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={updating || !user.role.can_edit}
              >
                {updating ? 'Guardando…' : 'Guardar cambios'}
              </Button>
              <Button LinkComponent={NextLink} href={paths.categories.index}>
                Cancelar
              </Button>
            </Stack>
            <CategoryProducts
              categoryId={category.id}
              products={category.products}
              refetch={refetch}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CategoryEditPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CategoryEditPage;
