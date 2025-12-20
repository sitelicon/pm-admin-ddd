import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { paths } from '../../paths';
import { Box } from '@mui/system';
import { DateTimePicker } from '@mui/x-date-pickers';
import { applyTypes, customerGroups, stores } from '../../api/discounts/data';
import { discountsApi } from '../../api/discounts';
import { categoriesApi } from '../../api/categories';

const initialValues = {
  name: '',
  description: '',
  active: false,
  from: null,
  to: null,
  stores: [],
  customerGroups: [],
  categories: [],
  applyTo: applyTypes[0].id,
  discountValue: 0,
  excludeOnSale: false,
  freeShipping: false,
  submit: null,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Requerido'),
  description: Yup.string().max(255, 'Máximo 255 caracteres.'),
  active: Yup.bool().required('Requerido'),
  from: Yup.date().nullable(),
  to: Yup.date().nullable(),
  stores: Yup.array().min(1, 'Seleccione al menos una tienda'),
  customerGroups: Yup.array().min(
    1,
    'Seleccione al menos un grupo de clientes',
  ),
  categories: Yup.array(),
  applyTo: Yup.string().required('Requerido'),
  discountValue: Yup.number()
    .min(0, 'El valor debe ser igual o superior a 0.')
    .required('Requerido'),
  excludeOnSale: Yup.bool().required('Requerido'),
  freeShipping: Yup.bool().required('Requerido'),
});

const returnChildrenIds = (acc, category) => {
  return [
    ...acc,
    category.id,
    ...category.children.reduce(returnChildrenIds, []),
  ];
};

const revertCategory = (acc, category, parentNames = []) => {
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
      childIds: category.children.reduce(returnChildrenIds, []),
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(childAcc, children, [...parentNames, data.name]),
      [],
    ),
  ];
};

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

export const DiscountCreateForm = () => {
  const router = useRouter();
  const { categories, loading: loadingCategories } = useCategories();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await discountsApi.createDiscount({
          name: values.name?.trim().length ? values.name.trim() : undefined,
          description: values.description?.trim().length
            ? values.description.trim()
            : undefined,
          active: values.active,
          from: values.from
            ? moment(values.from).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          to: values.to
            ? moment(values.to).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          type_id: values.applyTo,
          value: values.discountValue,
          exclude_on_sale_products: values.excludeOnSale,
          include_all_categories: values.categories.length === 0,
          free_shipping: values.freeShipping,
          stores: values.stores,
          customer_groups: values.customerGroups,
          categories: values.categories,
        });
        toast.success('Descuento creado');
        router.push(`/discounts/${response.id}`);
      } catch (err) {
        console.error(err);
        toast.error('¡Algo ha ido mal!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Nombre*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nombre del descuento"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Descripción
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(formik.touched.description && formik.errors.description)
                  }
                  fullWidth
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  label="Descripción breve del descuento"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Activo
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.active}
                      color="success"
                      name="active"
                      onChange={formik.handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={formik.values.active ? 'Si' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Fecha desde
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <DateTimePicker
                  clearable
                  format="dd/MM/yyyy HH:mm"
                  label="Aplicar a partir de"
                  name="from"
                  onBlur={formik.handleBlur}
                  onChange={(value) => formik.setFieldValue('from', value)}
                  renderInput={(params) => <TextField {...params} />}
                  value={formik.values.from}
                  slotProps={{
                    textField: {
                      error: !!(formik.touched.from && formik.errors.from),
                      helperText: formik.touched.from && formik.errors.from,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Fecha hasta
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <DateTimePicker
                  clearable
                  format="dd/MM/yyyy HH:mm"
                  label="Aplicar hasta"
                  name="to"
                  onBlur={formik.handleBlur}
                  onChange={(value) => formik.setFieldValue('to', value)}
                  renderInput={(params) => <TextField {...params} />}
                  value={formik.values.to}
                  slotProps={{
                    textField: {
                      error: !!(formik.touched.to && formik.errors.to),
                      helperText: formik.touched.to && formik.errors.to,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Tiendas*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.stores && formik.errors.stores)}
                  fullWidth
                  helperText={formik.touched.stores && formik.errors.stores}
                  label="Seleccione las tiendas"
                  name="stores"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ multiple: true }}
                  value={formik.values.stores}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name} ({store.code.toUpperCase()})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Grupos de clientes*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(
                      formik.touched.customerGroups &&
                      formik.errors.customerGroups
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.customerGroups &&
                    formik.errors.customerGroups
                  }
                  label="Seleccione los grupos de clientes"
                  name="customerGroups"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ multiple: true }}
                  value={formik.values.customerGroups}
                >
                  {customerGroups.map((customerGroup) => (
                    <MenuItem key={customerGroup.id} value={customerGroup.id}>
                      {customerGroup.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Aplicar a las categorías
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <Stack spacing={1}>
                  {loadingCategories && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CircularProgress color="black" size={18} />
                      <Typography variant="body2">
                        Cargando las categorías del producto...
                      </Typography>
                    </Stack>
                  )}
                  {!loadingCategories &&
                    formik.values.categories.length > 0 && (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          marginBottom: '6px !important',
                          marginTop: '0 !important',
                        }}
                      >
                        {formik.values.categories.map((id) => {
                          const category = categories.find(
                            ({ value }) => value === id,
                          );
                          return (
                            <Grid item key={id}>
                              <Tooltip
                                title={category.label}
                                placement="top"
                                arrow
                              >
                                <Chip
                                  variant="outlined"
                                  label={category.name}
                                  onDelete={() => {
                                    formik.setFieldValue(
                                      'categories',
                                      formik.values.categories.filter(
                                        (categoryId) => categoryId !== id,
                                      ),
                                    );
                                  }}
                                />
                              </Tooltip>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  <Autocomplete
                    openOnFocus
                    options={categories.filter(
                      (option) =>
                        !formik.values.categories.find(
                          (id) => id === option.value,
                        ),
                    )}
                    groupBy={(option) => option.label.split(' → ')[0]}
                    loading={loadingCategories}
                    noOptionsText="No hay coincidencias con los filtros aplicados."
                    onChange={(_, value) => {
                      if (!!value?.value) {
                        formik.setFieldValue('categories', [
                          ...formik.values.categories.filter(
                            (id) => id !== value.value,
                          ),
                          value.value,
                          ...value.childIds.filter(
                            (id) => !formik.values.categories.includes(id),
                          ),
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
                        helperText="Si no selecciona ninguna categoría, la promoción se aplicará a todas las categorías."
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Excluir productos en oferta
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.excludeOnSale}
                      name="excludeOnSale"
                      onChange={formik.handleChange}
                    />
                  }
                  label={formik.values.excludeOnSale ? 'Sí' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Gastos de envío gratis
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.freeShipping}
                      name="freeShipping"
                      onChange={formik.handleChange}
                    />
                  }
                  label={formik.values.freeShipping ? 'Sí' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Aplicar a*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.applyTo && formik.errors.applyTo)}
                  fullWidth
                  helperText={formik.touched.applyTo && formik.errors.applyTo}
                  label="Aplicar a"
                  name="applyTo"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.applyTo}
                >
                  {applyTypes.map((applyType) => (
                    <MenuItem key={applyType.id} value={applyType.id}>
                      {applyType.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Valor del descuento*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type="number"
                  error={
                    !!(
                      formik.touched.discountValue &&
                      formik.errors.discountValue
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.discountValue && formik.errors.discountValue
                  }
                  label="Valor del descuento"
                  name="discountValue"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.discountValue}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={1}
        >
          <Button
            color="inherit"
            component={NextLink}
            href={paths.discounts.index}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Crear descuento
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
