import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { apiRequest } from '../../utils/api-request';
import { toast } from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { customersApi } from '../../api/customers';

export const CustomerDataManagement = ({ customer, refetch, ...rest }) => {
  const [syncing, setSyncing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleICGSync = useCallback(async () => {
    try {
      setSyncing(true);
      const response = await apiRequest(`admin/customers/${customer.id}/icg`);
      toast.success('Sincronización completada');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Error al sincronizar con ICG: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  }, [customer.id, refetch]);

  const handleSendPasswordResetEmail = useCallback(async () => {
    if (
      window.confirm('¿Está seguro de que desea enviar el email?') === false
    ) {
      return;
    }
    try {
      setSendingEmail(true);
      await customersApi.sendPasswordResetEmail(customer.email);
      toast.success('Email enviado');
    } catch (err) {
      console.error(err);
      toast.error(`Error al enviar el email: ${err.message}`);
    } finally {
      setSendingEmail(false);
    }
  }, [customer.email]);

  const deleteCustomer = async () => {
    try {
      if (window.confirm('¿Está seguro de que desea eliminar la cuenta?')) {
        setDeleting(true);
        await customersApi.deleteCustomer(customer.id);
        toast.success('Cuenta eliminada');
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error al eliminar la cuenta: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <Card {...rest}>
      <CardHeader title="Gestión de datos" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={2}>
          <Button
            LinkComponent={NextLink}
            href={`/customers/${customer.id}/edit`}
            color="primary"
            variant="outlined"
          >
            Editar datos
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleSendPasswordResetEmail}
            disabled={sendingEmail}
          >
            {sendingEmail
              ? 'Enviando email…'
              : 'Enviar restablecimiento de contraseña'}
          </Button>

          <Stack spacing={1}>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleICGSync}
              disabled={syncing}
            >
              {syncing ? 'Sincronizando con ICG…' : 'Sincronizar con ICG'}
            </Button>
            <Typography color="text.secondary" variant="body2">
              Sincronice los datos de este cliente con los datos de ICG. Tenga
              en cuenta que esta acción puede tardar unos minutos.
            </Typography>
          </Stack>
          {!customer.deleted_at && (
            <Stack spacing={1}>
              <Button color="error" variant="outlined" onClick={deleteCustomer}>
                Eliminar cuenta
              </Button>
              <Typography color="text.secondary" variant="body2">
                Elimine la ficha de este cliente si él lo ha solicitado, si no,
                tenga en cuenta que lo que se ha eliminado{' '}
                <strong>no puede volver a recuperarse</strong>.
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

CustomerDataManagement.propTypes = {
  customer: PropTypes.object,
  refetch: PropTypes.func,
};
