import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import { ordersApi } from '../../../api/orders';

export const OrderBillingEditModal = ({
  open,
  onClose,
  onSubmit,
  order,
  ...other
}) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    address: '',
    locality: '',
    region: '',
    postalCode: '',
    country: '',
    phone: '',
    cif: '',
  });

  useEffect(() => {
    if (order) {
      setFormValues({
        firstName: order.billing_name,
        lastName: order.billing_last_name,
        address: order.billing_address,
        locality: order.billing_locality,
        region: order.billing_region,
        postalCode: order.billing_cp,
        country: order.billing_country,
        phone: order.billing_phone,
        cif: order.billing_cif,
      });
    }
  }, [order]);

  const handleClose = useCallback(() => {
    onClose?.();
    setFormValues({
      firstName: order.billing_name,
      lastName: order.billing_last_name,
      address: order.billing_address,
      locality: order.billing_locality,
      region: order.billing_region,
      postalCode: order.billing_cp,
      country: order.billing_country,
      phone: order.billing_phone,
      cif: order.billing_cif,
    });
  }, [onClose, order]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (loading) return;
      try {
        setLoading(true);
        await ordersApi.updateBillingAddress(order.id, formValues);
        toast.success('Dirección de facturación actualizada.');
        onSubmit?.();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar la dirección de facturación.');
      } finally {
        setLoading(false);
      }
    },
    [formValues, loading, onSubmit, order.id],
  );

  return (
    <Modal
      {...other}
      open={open}
      onClose={onClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...(other.sx || {}),
      }}
    >
      <Box>
        <Container maxWidth="md">
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Stack spacing={1} mb={1}>
                  <Typography variant="h5">Dirección de facturación</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Edita la información de facturación del pedido.
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Nombre"
                      variant="outlined"
                      value={formValues.firstName || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          firstName: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Apellidos"
                      variant="outlined"
                      value={formValues.lastName || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          lastName: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  type="text"
                  label="Dirección"
                  variant="outlined"
                  value={formValues.address || ''}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Localidad"
                      variant="outlined"
                      value={formValues.locality || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          locality: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Provincia"
                      variant="outlined"
                      value={formValues.region || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          region: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Código postal"
                      variant="outlined"
                      value={formValues.postalCode || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          postalCode: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="País"
                      variant="outlined"
                      value={
                        formValues.country?.trim() === 'M1'
                          ? 'Madeira/Azores'
                          : formValues.country?.trim() || 'Desconocido'
                      }
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          country: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Teléfono"
                      variant="outlined"
                      value={formValues.phone || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label="CIF"
                      variant="outlined"
                      value={formValues.cif || ''}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          cif: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    color="inherit"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Guardando cambios…' : 'Guardar cambios'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

OrderBillingEditModal.PropTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  order: PropTypes.object,
};
