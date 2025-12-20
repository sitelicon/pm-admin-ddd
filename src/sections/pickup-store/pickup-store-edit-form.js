import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { pickupStoresApi } from '../../api/pickup-stores';
import { useCountries } from '../../hooks/use-countries';
import { useRegions } from '../../hooks/use-regions';
import { Plus } from '@untitled-ui/icons-react';
import { useRouter } from 'next/router';

const BUSINESS_STATUS_OPTIONS = [
  'OPERATIONAL',
  'TEMPORARY_CLOSED',
  'PERMANENTLY_CLOSED',
];

const initialState = {
  erp_id: '',
  shipping_enabled: false,
  business_status: 'OPERATIONAL',
  address: '',
  locality: '',
  city: '',
  country: 'ES',
  prefix: '+34',
  zip: '',
  name: '',
  phone_number: '',
  lat: '',
  lng: '',
  opening_hours: [
    {
      day: '0',
      open: '',
      close: '',
    },
  ],
  description: '',
};

export const PickupStoreEditForm = ({ store, refetch }) => {
  const router = useRouter();
  const { countries, loading: loadingCountries } = useCountries();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [request, setRequest] = useState(initialState);
  const { regions, loading: loadingRegions } = useRegions(request.country);

  useEffect(() => {
    if (store) {
      setRequest({
        ...store,
        shipping_enabled: store.shipping_enabled ? '1' : '0',
        opening_hours: store.opening_hours.map((openingHour) => ({
          ...openingHour,
          day: openingHour.day,
          open: openingHour.open?.trim().length > 0 ? openingHour.open : null,
          close:
            openingHour.close?.trim().length > 0 ? openingHour.close : null,
        })),
      });
    }
  }, [store]);

  const addOpeningHour = useCallback(() => {
    setRequest((prevState) => ({
      ...prevState,
      opening_hours: [
        ...prevState.opening_hours,
        {
          day: prevState.opening_hours.length.toString(),
          open: '',
          close: '',
        },
      ],
    }));
  }, []);

  const removeOpeningHour = useCallback(
    (index) => {
      if (request.opening_hours.length === 1) {
        toast.error('Debe haber al menos un horario de apertura.');
        return;
      }
      setRequest((prevState) => ({
        ...prevState,
        opening_hours: prevState.opening_hours.filter((_, i) => i !== index),
      }));
    },
    [request.opening_hours.length],
  );

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        await pickupStoresApi.updateStore(store.id, request);
        toast.success('Los cambios se han guardado correctamente.');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo guardar los cambios.');
      } finally {
        setLoading(false);
      }
    },
    [request, refetch, store],
  );

  const handleDeleteShop = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        !window.confirm(
          '¿Está seguro que desea eliminar esta tienda física? Esta acción es irreversible.',
        )
      ) {
        return;
      }
      try {
        setDeleting(true);
        await pickupStoresApi.deleteStore(store.id);
        toast.success('La tienda física se ha eliminado correctamente.');
        router.push('/pickup-stores');
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar la tienda física.');
      } finally {
        setDeleting(false);
      }
    },
    [store, router],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader
          title="Datos de la tienda"
          subheader="Estos datos se mostrarán en la página web."
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="text"
                  label="ID ERP"
                  autoComplete="new-pickup-store-erp-id"
                  value={request.erp_id}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      erp_id: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={9}>
                <TextField
                  type="text"
                  label="Nombre"
                  autoComplete="new-pickup-store-name"
                  value={request.name}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <TextField
              type="text"
              label="Descripción"
              autoComplete="new-pickup-store-description"
              multiline
              rows={3}
              value={request.description}
              onChange={(e) =>
                setRequest((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
              fullWidth
              required
            />
            <TextField
              type="text"
              label="Dirección"
              autoComplete="new-pickup-store-address"
              value={request.address}
              onChange={(e) =>
                setRequest((prevState) => ({
                  ...prevState,
                  address: e.target.value,
                }))
              }
              fullWidth
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="Provincia"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="new-pickup-store-locality"
                  value={request.locality}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      locality: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  {regions
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((region) => (
                      <option key={region.id} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Ciudad"
                  autoComplete="new-pickup-store-city"
                  value={request.city}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      city: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="País"
                  autoComplete="new-pickup-store-country"
                  value={request.country}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      country: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  {countries
                    .sort((a, b) => a.nicename.localeCompare(b.nicename))
                    .map((country) => (
                      <option key={country.id} value={country.iso}>
                        {country.nicename} ({country.iso})
                      </option>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Código postal"
                  autoComplete="new-pickup-store-zip"
                  value={request.zip}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      zip: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="text"
                  label="Prefijo"
                  autoComplete="new-pickup-store-prefix"
                  value={request.prefix}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      prefix: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  type="text"
                  label="Teléfono"
                  autoComplete="new-pickup-store-phone-number"
                  value={request.phone_number}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      phone_number: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Latitud"
                  autoComplete="new-pickup-store-lat"
                  value={request.lat}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      lat: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Longitud"
                  autoComplete="new-pickup-store-lng"
                  value={request.lng}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      lng: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="Estado del negocio"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="new-pickup-store-business-status"
                  value={request.business_status}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      business_status: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  {BUSINESS_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  label="Envío habilitado"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="new-pickup-store-shipping-enabled"
                  value={request.shipping_enabled}
                  onChange={(e) =>
                    setRequest((prevState) => ({
                      ...prevState,
                      shipping_enabled: e.target.value,
                    }))
                  }
                  fullWidth
                  required
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </TextField>
              </Grid>
            </Grid>
            <Divider />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Horarios de apertura</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={addOpeningHour}
                startIcon={
                  <SvgIcon fontSize="small">
                    <Plus />
                  </SvgIcon>
                }
                disabled={
                  loading || deleting || request.opening_hours.length >= 7
                }
              >
                Agregar horario
              </Button>
            </Stack>
            {request.opening_hours.map((openingHour, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    SelectProps={{ native: true }}
                    label="Día"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="new-pickup-store-opening-hours-day"
                    value={openingHour.day}
                    onChange={(e) =>
                      setRequest((prevState) => ({
                        ...prevState,
                        opening_hours: prevState.opening_hours.map(
                          (item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                day: e.target.value,
                              };
                            }
                            return item;
                          },
                        ),
                      }))
                    }
                    fullWidth
                    required
                    disabled
                  >
                    <option value="" disabled>
                      Seleccione una opción
                    </option>
                    <option value="0">Domingo</option>
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="text"
                    label="Apertura"
                    autoComplete="new-pickup-store-opening-hours-open"
                    value={openingHour.open}
                    onChange={(e) =>
                      setRequest((prevState) => ({
                        ...prevState,
                        opening_hours: prevState.opening_hours.map(
                          (item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                open: e.target.value,
                              };
                            }
                            return item;
                          },
                        ),
                      }))
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="text"
                    label="Cierre"
                    autoComplete="new-pickup-store-opening-hours-close"
                    value={openingHour.close}
                    onChange={(e) =>
                      setRequest((prevState) => ({
                        ...prevState,
                        opening_hours: prevState.opening_hours.map(
                          (item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                close: e.target.value,
                              };
                            }
                            return item;
                          },
                        ),
                      }))
                    }
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeOpeningHour(index)}
                    disabled={request.opening_hours.length === 1}
                    fullWidth
                  >
                    Eliminar
                  </Button>
                </Grid> */}
              </Grid>
            ))}
          </Box>
        </CardContent>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 3 }}
        >
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={loading || deleting}
          >
            {loading ? 'Guardando cambios…' : 'Guardar cambios'}
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              onClick={() => setRequest(store || initialState)}
              disabled={loading}
            >
              Descartar cambios
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteShop}
              disabled={loading || deleting}
            >
              Eliminar tienda
            </Button>
          </Stack>
        </Stack>
      </Card>
    </form>
  );
};

PickupStoreEditForm.propTypes = {
  store: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
