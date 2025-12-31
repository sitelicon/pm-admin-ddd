import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Stack,
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
      setState((prevState) => ({ ...prevState, roles: response.items }));
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
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setEmail(account.email);
      setRoleId(account.role?.id);
    }
  }, [account]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdating(true);
        await usersApi.updateUser(account.id, {
          name,
          email,
          roleId,
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
    [account, name, email, roleId, refetch],
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

  const handleFormSubmitPassword = useCallback(
    async (event) => {
      event.preventDefault();

      if (password.length > 0 && password !== repeatPassword) {
        toast.error('Las contraseñas no coinciden.');
        return;
      }

      try {
        setUpdating(true);
        await usersApi.updateUserPassword(account.id, {
          password: password.length > 0 ? password : undefined,
        });
        toast.success('La contraseña se ha actualizado correctamente.');
        setPassword('');
        setRepeatPassword('');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar la contraseña.');
      } finally {
        setUpdating(false);
      }
    },
    [account, password, refetch, repeatPassword],
  );

  return (
    <Stack>
      <Box>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader
              title="Modificar datos de la cuenta"
              subheader="Al modificar un usuario, sus sesiones activas se cerrarán por seguridad."
            />
            <CardContent sx={{ py: 0 }}>
              <Stack>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  gap={{ xs: 0, md: 2 }}
                >
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
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  gap={{ xs: 0, md: 2 }}
                >
                  <Autocomplete
                    disablePortal
                    fullWidth
                    options={roles}
                    getOptionLabel={(option) => option.name}
                    value={roles.find((role) => role.id === roleId) || null}
                    onChange={(event, newValue) => {
                      event.preventDefault();
                      setRoleId(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Rol"
                        margin="normal"
                        disabled={loading || loadingRoles}
                        required
                      />
                    )}
                  />
                  <FormControlLabel
                    sx={{ minWidth: '49%' }}
                    control={
                      <Checkbox
                        checked={canEdit}
                        onChange={(event) => setCanEdit(event.target.checked)}
                        name="can_edit_orders"
                      />
                    }
                    label="Puede editar estados de pedidos"
                    variant="body2"
                  />
                </Stack>
              </Stack>
            </CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 3 }}
              justifyContent={'space-between'}
            >
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
                variant="outlined"
                onClick={handleDelete}
                disabled={loading}
              >
                {deleting ? 'Eliminando…' : 'Eliminar'}
              </Button>
            </Stack>
          </Card>
        </form>
      </Box>
      <Box>
        <form onSubmit={handleFormSubmitPassword}>
          <Card sx={{ mt: 3 }}>
            <CardHeader
              title="Cambiar contraseña"
              subheader="Si deseas cambiar la contraseña, ingresa una nueva. De lo contrario, deja los campos vacíos."
            />
            <CardContent sx={{ py: 0 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                gap={{ xs: 0, md: 2 }}
              >
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
              </Stack>
            </CardContent>
            <Stack direction="row" spacing={2} sx={{ p: 3 }}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {updating ? 'Guardando...' : 'Guardar contraseña'}
              </Button>
            </Stack>
          </Card>
        </form>
      </Box>
    </Stack>
  );
};

AccountEditForm.propTypes = {
  acount: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
