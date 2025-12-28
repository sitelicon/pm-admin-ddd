import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { usersApi } from '../../api/users';

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

export const AccountCreateModal = ({ open, onClose, onConfirm, ...other }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [roleId, setRoleId] = useState(1);
  const [loading, setLoading] = useState(false);
  const { roles, loading: loadingRoles } = useAccountRoles();

  useEffect(() => {
    if (roles?.length > 0) {
      setRoleId(roles[0].id);
    }
  }, [roles]);

  const handleClose = useCallback(() => {
    onClose?.();
    setName('');
    setEmail('');
    setPassword('');
    setRepeatPassword('');
    setRoleId(roles[0].id);
  }, [onClose, roles]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (password !== repeatPassword) {
        toast.error('Las contraseñas no coinciden.');
        return;
      }

      try {
        setLoading(true);
        await usersApi.createUser({ name, email, password, roleId });
        toast.success('La cuenta se ha creado correctamente.');
        onConfirm?.();
        handleClose();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo crear la cuenta.');
      } finally {
        setLoading(false);
      }
    },
    [onConfirm, handleClose, name, email, password, repeatPassword, roleId],
  );

  return (
    <Modal
      {...other}
      open={open}
      onClose={handleClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...(other.sx || {}),
      }}
    >
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h5">Crear cuenta</Typography>
                <Typography color="text.secondary" variant="body2">
                  Complete el siguiente formulario para crear una cuenta para el
                  administrador.
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  label="Nombre y apellidos"
                  autoComplete="new-account-name"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  required
                />
                <TextField
                  fullWidth
                  type="email"
                  autoComplete="new-account-email"
                  label="Correo electrónico"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  autoComplete="new-account-password"
                  label="Contraseña"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  autoComplete="new-account-repeat-password"
                  label="Repetir contraseña"
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  value={repeatPassword}
                  error={password.length > 0 && repeatPassword !== password}
                  helperText={
                    password.length > 0 && repeatPassword !== password
                      ? 'Las contraseñas no coinciden.'
                      : ''
                  }
                  required
                />
                <TextField
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  autoComplete="new-account-role"
                  label="Rol"
                  onChange={(event) => setRoleId(event.target.value)}
                  value={roleId}
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
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button color="inherit" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Añadiendo cuenta…' : 'Añadir cuenta'}
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
