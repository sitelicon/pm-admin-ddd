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

export const OrderCustomerEditModal = ({
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
    email: '',
  });

  useEffect(() => {
    if (order) {
      setFormValues({
        firstName: order.customer_firstname,
        lastName: order.customer_lastname,
        email: order.customer_email,
      });
    }
  }, [order]);

  const handleClose = useCallback(() => {
    onClose?.();
    setFormValues({
      firstName: order.customer_firstname,
      lastName: order.customer_lastname,
      email: order.customer_email,
    });
  }, [onClose, order]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (loading) return;
      try {
        setLoading(true);
        await ordersApi.updateCustomerInfo(order.id, formValues);
        toast.success('Información del cliente actualizada.');
        onSubmit?.();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar la información del cliente.');
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
                  <Typography variant="h5">Información del cliente</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Edita la información de envío del pedido.
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
                  type="email"
                  label="Correo electrónico"
                  variant="outlined"
                  value={formValues.email || ''}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
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

OrderCustomerEditModal.PropTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  order: PropTypes.object,
};
