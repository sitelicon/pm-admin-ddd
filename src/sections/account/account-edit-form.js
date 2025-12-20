import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { usersApi } from '../../api/users';
import { useRouter } from 'next/router';
import { paths } from '../../paths';

const useAccountRoles = () => {
  const [state, setState] = useState({
    roles: [],
    loading: false,
  });

  const getRoles = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await usersApi.getRoles();
      setState((prevState) => ({ ...prevState, roles: response }));
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar los roles.');
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return state;
};

export const AccountEditForm = ({ account, refetch }) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const loading = useMemo(() => updating || deleting, [updating, deleting]);
  const { roles, loading: loadingRoles } = useAccountRoles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(1);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState(false);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setEmail(account.email);
      setRoleId(account.role?.id);
      setEditOrderStatus(account.edit_order_status);
    }
  }, [account]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (password.length > 0 && password !== repeatPassword) {
        toast.error('Las contraseñas no coinciden.');
        return;
      }

      try {
        setUpdating(true);
        await usersApi.updateUser(account.id, {
          name,
          email,
          roleId,
          edit_order_status: editOrderStatus,
          password: password.length > 0 ? password : undefined,
        });
        toast.success('Los cambios se han guardado correctamente.');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo guardar los cambios.');
      } finally {
        setUpdating(false);
      }
    },
    [
      account,
      name,
      email,
      roleId,
      password,
      refetch,
      repeatPassword,
      editOrderStatus,
    ],
  );

  const handleDelete = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          '¿Estás seguro de eliminar este usuario? Esta acción es irreversible. Una vez elimine la cuenta, las sesiones activas del usuario se cerrarán por seguridad.',
        ) === false
      ) {
        return;
      }
      try {
        setDeleting(true);
        await usersApi.deleteUser(account.id);
        toast.success('El usuario se ha eliminado correctamente.');
        router.push(paths.accounts.list.index);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el usuario.');
      } finally {
        setDeleting(false);
      }
    },
    [account, router],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader
          title="Modificar datos de la cuenta"
          subheader="Al modificar un usuario, sus sesiones activas se cerrarán por seguridad."
        />
        <CardContent sx={{ py: 0 }}>
          <TextField
            fullWidth
            type="text"
            label="Nombre y apellidos"
            margin="normal"
            onChange={(event) => setName(event.target.value)}
            value={name}
            disabled={loading}
            required
          />
          <TextField
            fullWidth
            type="email"
            label="Correo electrónico"
            margin="normal"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            disabled={loading}
            required
          />
          <TextField
            fullWidth
            select
            SelectProps={{ native: true }}
            label="Rol"
            margin="normal"
            onChange={(event) => setRoleId(event.target.value)}
            value={roleId}
            disabled={loading}
            required
          >
            {loadingRoles ? (
              <option value="" disabled>
                Cargando roles…
              </option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            )}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={editOrderStatus}
                onChange={(event) => setEditOrderStatus(event.target.checked)}
                disabled={loading}
              />
            }
            label={
              editOrderStatus
                ? 'Puede editar el estado de los pedidos'
                : 'No puede editar el estado de los pedidos'
            }
          />
          <TextField
            fullWidth
            type="password"
            label="Nueva contraseña"
            margin="normal"
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            disabled={loading}
          />
          <TextField
            fullWidth
            type="password"
            label="Repetir contraseña"
            margin="normal"
            onChange={(event) => setRepeatPassword(event.target.value)}
            value={repeatPassword}
            disabled={loading}
            error={password.length > 0 && password !== repeatPassword}
            helperText={
              password.length > 0 && password !== repeatPassword
                ? 'Las contraseñas no coinciden.'
                : ''
            }
          />
        </CardContent>
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {updating ? 'Guardando cambios…' : 'Guardar cambios'}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </Stack>
      </Card>
    </form>
  );
};

AccountEditForm.propTypes = {
  acount: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
