import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { ProductAttributeCreate } from './product-attribute-create';
import { categoriesApi } from '../../api/categories';
import { useMounted } from '../../hooks/use-mounted';
import { SeverityPill } from '../../components/severity-pill';
import { QuillEditor } from '../../components/quill-editor';
import { useStores } from '../../hooks/use-stores';
import { Check } from '@mui/icons-material';
import { Link01, LinkExternal01, Share04 } from '@untitled-ui/icons-react';
import { useLanguageId } from '../../hooks/use-language-id';
import { toast } from 'react-hot-toast';
import { productsApi } from '../../api/products';
import moment from 'moment';
import { useAuth } from '../../hooks/use-auth';

const LANGUAGE_CODES = {
  1: 'es',
  2: 'en',
  3: 'fr',
  4: 'pt',
  5: 'it',
  6: 'de',
  7: 'mad',
};

const FAMILY_NAMES = [
  'STAR',
  'LIVING',
  'FLOW',
  'SUMMIT',
  'ACTION',
  'ROUTE',
  'DESTINY',
  'UNIVERSE',
  'LIMITED',
  'EDITION',
  'COMPACT',
  'WALK BAG',
  'WALK FLY',
  'NOMAD',
  'WALK',
  'NEW ROYAL',
  'EASY',
  'JUMP',
  'SMART',
  'ELEGANT NEW',
  'UNIVERSE BUSINESS',
  'ROAD',
  'STYLE',
  'AIR',
  'COMPASS',
  'CAMP',
  'CLOUD',
  'WAY',
  'PRIORITY',
  'LIGHTBOX',
  'GLOW',
  'CITY',
  'ADVENTURE',
  'FLASH',
  'DREAMS',
  'TIME',
  'FLEX',
  'CLICK',
  'METAL',
];

const revertCategory = (acc, category, parentNames = [], parentIds = []) => {
  const data = category.data.find(({ language_id }) => language_id === 1);

  if (!data) {
    return acc;
  }

  return [
    ...acc,
    {
      label: [...parentNames, data.name].join(' → '),
      name: data.name,
      value: category.id,
      parentIds,
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(
          childAcc,
          children,
          [...parentNames, data.name],
          [...parentIds, category.id],
        ),
      [],
    ),
  ];
};

const trolleyOptions = ['Alumino', 'Acero', 'Acero lacado', 'Ergonómico'];

const padlockOptions = ['No', 'Candado TSA', 'Candado combinación'];

const handleOptions = [
  'Corta',
  'Larga',
  'Media',
  'Doble',
  'De cadena',
  'Sin asa',
];

const sizeOptions = ['Grande', 'Mediana', 'Cabina'];

const wheelsOptions = [
  '2 ruedas',
  '4 ruedas multidireccionales',
  '4 ruedas dobles multidireccionales',
  'Ruedas silenciosas',
];

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategories();
      setCategories(
        response.reduce((acc, category) => revertCategory(acc, category), []),
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { categories, loading };
};

export const ProductAttributes = ({ product, selectOptions, refetch }) => {
  const { user } = useAuth();
  const languageId = useLanguageId();
  const anchorRef = useRef(null);
  const { categories: defaultCategories, loading: loadingCategories } =
    useCategories();
  const defaultStores = useStores();
  const [updatingCategories, setUpdatingCategories] = useState(false);
  const [updatingStores, setUpdatingStores] = useState(false);
  const [updatingAttributes, setUpdatingAttributes] = useState(false);
  const [firstClass, setFirstClass] = useState(product.first_class);
  const [travel, setTravel] = useState(product.travel);
  const [newFrom, setNewFrom] = useState(product.new_from);
  const [newTo, setNewTo] = useState(product.new_to);
  const [featureId, setFeatureId] = useState(product.feature_id);
  const [name, setName] = useState(
    product.names.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [categories, setCategories] = useState([]);
  const [expandable, setExpandable] = useState(product.expandable);
  const [lightweight, setLightweight] = useState(product.lightweight);
  const [isGiftCard, setIsGiftCard] = useState(product.is_gift_card);
  const [internalOrganizer, setInternalOrganizer] = useState(
    product.internal_organizer,
  );
  const [secretPocket, setSecretPocket] = useState(product.secret_pocket);
  const [height, setHeight] = useState(product.height || '');
  const [width, setWidth] = useState(product.width || '');
  const [depth, setDepth] = useState(product.depth || '');
  const [weight, setWeight] = useState(product.weight || 0);
  const [capacity, setCapacity] = useState(product.capacity || '');
  const [inches, setInches] = useState(product.inches || '');
  const [family, setFamily] = useState(product.family || '');
  const [description, setDescription] = useState(
    product.descriptions.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [trolley, setTrolley] = useState(
    product.trolleys.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [wheel, setWheel] = useState(
    product.wheels.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [padlock, setPadlock] = useState(
    product.padlocks.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [handle, setHandle] = useState(
    product.handles.find(({ language_id }) => language_id === languageId)
      ?.value || '',
  );
  const [colorId, setColorId] = useState(product.color_id);
  const [compositionId, setCompositionId] = useState(product.composition_id);
  const [sizeId, setSizeId] = useState(product.size_id);

  const [reference, setReference] = useState(product.reference || '');
  const [url, setUrl] = useState(
    product.urls.find(({ language_id }) => language_id === languageId)?.url ||
      '',
  );
  const [stores, setStores] = useState(
    product.stores?.map(({ id }) => id) || [],
  );
  const stock = useMemo(
    () => product.stock.find(({ warehouse_id }) => warehouse_id === 1),
    [product.stock],
  );

  useEffect(() => {
    setName(
      product.names.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setDescription(
      product.descriptions.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setTrolley(
      product.trolleys.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setWheel(
      product.wheels.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setPadlock(
      product.padlocks.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setHandle(
      product.handles.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    );
    setUrl(
      product.urls.find(({ language_id }) => language_id === languageId)?.url ||
        '',
    );
  }, [languageId, product]);

  useEffect(() => {
    if (defaultCategories.length && product.categories.length) {
      setCategories(
        product.categories
          .map(({ id }) => defaultCategories.find(({ value }) => value === id))
          .filter((category) => !!category),
      );
    }
  }, [defaultCategories, product.categories]);

  const updateProductAttributes = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingAttributes(true);
        await productsApi.updateProductAttributes({
          productId: product.id,
          languageId,
          reference: reference.trim(),
          name: name.trim(),
          description: description.trim(),
          trolley,
          wheel,
          padlock,
          handle,
          url,
          expandable,
          lightweight,
          isGiftCard,
          internalOrganizer,
          secretPocket,
          height,
          width,
          depth,
          weight,
          capacity,
          inches,
          firstClass,
          travel,
          newFrom: newFrom ? moment(newFrom).format('YYYY-MM-DD') : null,
          newTo: newTo ? moment(newTo).format('YYYY-MM-DD') : null,
          colorId,
          compositionId,
          sizeId,
          featureId,
          family: family.length > 0 ? family : undefined,
        });
        toast.success('Producto actualizado');
        refetch();
      } catch (err) {
        console.error(err);
        if (err.message) {
          switch (err.message) {
            case 'La URL ya existe en otro producto':
              return toast.error(
                'La URL ya existe en otro producto, por favor elija otra.',
              );
            default:
              return toast.error('No se pudo actualizar el producto');
          }
        }
      } finally {
        setUpdatingAttributes(false);
      }
    },
    [
      product,
      refetch,
      languageId,
      reference,
      name,
      description,
      trolley,
      wheel,
      padlock,
      handle,
      url,
      expandable,
      lightweight,
      internalOrganizer,
      secretPocket,
      height,
      width,
      depth,
      weight,
      capacity,
      inches,
      firstClass,
      newFrom,
      newTo,
      travel,
      colorId,
      compositionId,
      sizeId,
      featureId,
      family,
      isGiftCard,
    ],
  );

  const updateCategories = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingCategories(true);
        await productsApi.updateProductCategories({
          productId: product.id,
          categories: categories.map(({ value }) => value),
        });
        toast.success('Categorías actualizadas');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron actualizar las categorías');
      } finally {
        setUpdatingCategories(false);
      }
    },
    [product, categories, refetch],
  );

  const updateStores = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingStores(true);
        await productsApi.updateProductStores({
          productId: product.id,
          stores,
        });
        toast.success('Tiendas actualizadas');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron actualizar las tiendas');
      } finally {
        setUpdatingStores(false);
      }
    },
    [product, stores, refetch],
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Visibilidad por tienda"
                subheader="Seleccione en qué tiendas desea que el producto esté disponible."
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
              <Stack direction="row" spacing={2} sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={updateStores}
                  disabled={
                    loadingCategories ||
                    updatingCategories ||
                    updatingAttributes ||
                    updatingStores ||
                    !user.role.can_edit
                  }
                >
                  {updatingStores ? 'Guardando tiendas…' : 'Guardar tiendas'}
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Categorías del producto"
                subheader="Seleccione en qué categorías desea que el producto esté disponible."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
                action={
                  <Button
                    color="error"
                    ref={anchorRef}
                    onClick={() => setCategories([])}
                    disabled={!user.role.can_edit}
                  >
                    Vaciar
                  </Button>
                }
              />
              <Divider sx={{ mb: 1 }} />
              <CardContent sx={{ py: 0 }}>
                <Stack spacing={1}>
                  {loadingCategories && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CircularProgress color="black" size={18} />
                      <Typography variant="body2">
                        Cargando las categorías del producto...
                      </Typography>
                    </Stack>
                  )}
                  {categories.length > 0 && (
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        marginBottom: '6px !important',
                        marginTop: '0 !important',
                      }}
                    >
                      {categories
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((category) => (
                          <Grid item key={category.value}>
                            <Tooltip
                              title={category.label}
                              placement="top"
                              arrow
                            >
                              <Chip
                                variant="outlined"
                                label={category.label}
                                disabled={!user.role.can_edit}
                                onDelete={() => {
                                  setCategories(
                                    categories.filter(
                                      ({ value }) => value !== category.value,
                                    ),
                                  );
                                }}
                              />
                            </Tooltip>
                          </Grid>
                        ))}
                    </Grid>
                  )}
                  <Autocomplete
                    disabled={!user.role.can_edit}
                    openOnFocus
                    options={defaultCategories.filter(
                      (option) =>
                        !categories.find(({ value }) => value === option.value),
                    )}
                    groupBy={(option) => option.label.split(' → ')[0]}
                    loading={loadingCategories}
                    noOptionsText="No hay coincidencias, cree una nueva categoría."
                    onChange={(_, value) => {
                      if (!!value?.value) {
                        setCategories((prev) => [
                          ...prev.filter(
                            (option) =>
                              option.value !== value.value &&
                              !value.parentIds.includes(option.value),
                          ),
                          ...value.parentIds.map((id) =>
                            defaultCategories.find(
                              (option) => option.value === id,
                            ),
                          ),
                          value,
                        ]);
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ fontSize: 14 }} {...props}>
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Buscar categorías por nombre…"
                        label="Buscador de categorías"
                        helperText="Recuerde que puede configurar la posición en la que se mostrará el producto dentro de la categoría en la sección de edición de categorías del administrador."
                      />
                    )}
                  />
                </Stack>
              </CardContent>
              <Stack direction="row" spacing={2} sx={{ p: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={updateCategories}
                  disabled={
                    loadingCategories ||
                    updatingAttributes ||
                    updatingCategories ||
                    updatingStores ||
                    !user.role.can_edit
                  }
                >
                  {updatingCategories
                    ? 'Guardando categorías…'
                    : 'Guardar categorías'}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h6">Atributos del producto</Typography>
              <Typography variant="body2" color="text.secondary">
                Puede cambiar el idioma de la plataforma para editar los
                atributos del producto en otro lenguaje.
              </Typography>
            </Stack>
            <Divider />
          </Stack>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  type="text"
                  fullWidth
                  label="SKU"
                  value={product.sku}
                  disabled
                />
                <TextField
                  type="text"
                  fullWidth
                  label="Nombre"
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                />
                <TextField
                  type="text"
                  fullWidth
                  label="URL de enlace"
                  helperText={
                    <>
                      <Box component="span" display="block" mb={0.25}>
                        Los enlaces deben ser únicos, no pueden contener
                        espacios y solo pueden contener caracteres
                        alfanuméricos, guiones y guiones bajos. El producto será
                        accesible en:
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SvgIcon fontSize="inherit" color="action">
                          <LinkExternal01 />
                        </SvgIcon>
                        <Box component="span" display="block">
                          <Tooltip
                            arrow
                            placement="top"
                            title="Abrir en una nueva pestaña"
                          >
                            <Link
                              href={`https://pacomartinez.com/${LANGUAGE_CODES[languageId]}/${url}`}
                              target="_blank"
                              rel="noopener noreferre"
                            >
                              https://pacomartinez.com/
                              {LANGUAGE_CODES[languageId]}/{url}
                            </Link>
                          </Tooltip>
                        </Box>
                      </Stack>
                    </>
                  }
                  value={url}
                  onChange={({ target }) =>
                    setUrl(
                      target.value
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, '-')
                        .trim()
                        .toLowerCase(),
                    )
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Referencia"
                value={reference}
                // onChange={({ target }) => setReference(target.value)}
                sx={{ mb: 3 }}
                disabled
              />
              <TextField
                type="number"
                fullWidth
                label="Stock A1"
                value={stock?.quantity || 0}
                sx={{ mb: 3 }}
                disabled
              />
              <TextField
                type="number"
                fullWidth
                label="Stock Disponible"
                value={stock?.available_quantity || 0}
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setFirstClass((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={firstClass} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        FIRST CLASS
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto es de primera clase o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={firstClass ? 'success' : 'warning'}>
                    {firstClass ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setTravel((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={travel} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        TRAVEL
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto es de tipo travel o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={travel ? 'success' : 'warning'}>
                    {travel ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                clearable
                format="dd/MM/yyyy"
                label="Novedad desde"
                onChange={setNewFrom}
                renderInput={(params) => <TextField {...params} />}
                value={newFrom ? new Date(newFrom) : undefined}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                clearable
                format="dd/MM/yyyy"
                label="Novedad hasta"
                onChange={setNewTo}
                renderInput={(params) => <TextField {...params} />}
                value={newTo ? new Date(newTo) : undefined}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setExpandable((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={expandable} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        EXPANDIBLE
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto es expandible o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={expandable ? 'success' : 'warning'}>
                    {expandable ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setLightweight((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={lightweight} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        LIGEREZA
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto es ligero o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={lightweight ? 'success' : 'warning'}>
                    {lightweight ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setInternalOrganizer((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={internalOrganizer} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        ORGANIZADOR INTERNO
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto tiene organizador interno o
                        no.
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
                    color={internalOrganizer ? 'success' : 'warning'}
                  >
                    {internalOrganizer ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setSecretPocket((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={secretPocket} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        BOLSILLO SECRETO
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto tiene bolsillo secreto o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={secretPocket ? 'success' : 'warning'}>
                    {secretPocket ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Capacidad"
                value={capacity}
                onChange={({ target }) => setCapacity(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Alto"
                value={height}
                onChange={({ target }) => setHeight(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Ancho"
                value={width}
                onChange={({ target }) => setWidth(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Profundidad"
                value={depth}
                onChange={({ target }) => setDepth(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                fullWidth
                label="Peso"
                value={weight}
                onChange={({ target }) => setWeight(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Tamaño pantalla"
                value={inches}
                onChange={({ target }) => setInches(target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Trolley"
                value={trolley}
                onChange={({ target }) => setTrolley(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {trolleyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                fullWidth
                label="Ruedas"
                value={wheel}
                onChange={({ target }) => setWheel(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {wheelsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Candado"
                value={padlock}
                onChange={({ target }) => setPadlock(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {padlockOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Asas"
                value={handle}
                onChange={({ target }) => setHandle(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {handleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Tamaño"
                value={sizeId}
                onChange={({ target }) => setSizeId(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {selectOptions.sizes.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Color"
                value={colorId}
                onChange={({ target }) => setColorId(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {selectOptions.colors.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name_admin} ({option.hexadecimal})
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Composición"
                value={compositionId}
                onChange={({ target }) => setCompositionId(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {selectOptions.compositions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Característica"
                value={featureId}
                onChange={({ target }) => setFeatureId(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {selectOptions.features.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="text"
                fullWidth
                label="Familia"
                value={family}
                onChange={({ target }) => setFamily(target.value)}
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {FAMILY_NAMES.sort((a, b) => a.localeCompare(b)).map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ),
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <ListItem
                onClick={() => setIsGiftCard((prev) => !prev)}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  },
                }}
              >
                <Checkbox checked={isGiftCard} />
                <ListItemText
                  disableTypography
                  primary={
                    <Stack spacing={-0.25}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        fontWeight={500}
                      >
                        PRODUCTO ESPECIAL - TARJETA REGALO
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        Seleccione si el producto es producto especial o no.
                      </Typography>
                    </Stack>
                  }
                />
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="caption"
                >
                  <SeverityPill color={isGiftCard ? 'success' : 'warning'}>
                    {isGiftCard ? 'Si' : 'No'}
                  </SeverityPill>
                </Typography>
              </ListItem>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Descripción
                </Typography>
                <QuillEditor
                  onChange={setDescription}
                  placeholder="Escriba una descripción del producto…"
                  sx={{ height: 300 }}
                  value={description}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={updateProductAttributes}
            disabled={
              loadingCategories ||
              updatingAttributes ||
              updatingCategories ||
              updatingStores ||
              product.deleted_at !== null ||
              !user.role.can_edit
            }
          >
            {updatingAttributes ? 'Guardando atributos…' : 'Guardar atributos'}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

ProductAttributes.propTypes = {
  product: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
