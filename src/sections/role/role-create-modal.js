import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { usersApi } from '../../api/users';
import { useSections } from '../../layouts/dashboard/config';
import { SeverityPill } from '../../components/severity-pill';
import { Scrollbar } from '../../components/scrollbar';

export const RoleCreateModal = ({ open, onClose, onConfirm, ...other }) => {
  const sections = useSections();
  const [name, setName] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose?.();
    setName('');
  }, [onClose]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (menus.length === 0) {
        toast.error('Debe seleccionar al menos una sección.');
        return;
      }

      try {
        setLoading(true);
        await usersApi.createRole({ name, can_edit: canEdit, menus });
        toast.success('El rol se ha creado correctamente.');
        onConfirm?.();
        handleClose();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo crear el rol.');
      } finally {
        setLoading(false);
      }
    },
    [handleClose, onConfirm, name, menus, canEdit],
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
                <Scrollbar sx={{ height: 'calc(100vh - 150px)', width: 400 }}>
                  <Box>
                    <Typography variant="h5">Crear rol</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Complete el siguiente formulario para crear un nuevo rol.
                    </Typography>
                    <TextField
                      fullWidth
                      margin="normal"
                      type="text"
                      label="Nombre"
                      autoComplete="new-role-name"
                      onChange={(event) => setName(event.target.value)}
                      value={name}
                      required
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={canEdit}
                          onChange={(event) => setCanEdit(event.target.checked)}
                          name="can_edit"
                        />
                      }
                      label="Puede editar/crear/eliminar en secciones"
                      variant="body2"
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Gestionar permisos
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Seleccione a qué secciones tendrá acceso el rol.
                    </Typography>
                    <List>
                      {sections
                        .reduce((acc, section) => {
                          return [
                            ...acc,
                            ...section.items.map((item) => ({
                              title: item.title,
                              icon: item.icon,
                            })),
                          ];
                        }, [])
                        .map((section) => {
                          const isSelected = menus.some(
                            ({ code }) => code === section.title,
                          );
                          return (
                            <ListItem
                              key={section.title}
                              onClick={() =>
                                setMenus((prev) =>
                                  prev.some(
                                    ({ code }) => code === section.title,
                                  )
                                    ? prev.filter(
                                        ({ code }) => code !== section.title,
                                      )
                                    : [...prev, { code: section.title }],
                                )
                              }
                              sx={{
                                border: (theme) =>
                                  `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                  cursor: 'pointer',
                                },
                                '&:not(:last-child)': {
                                  mb: 1,
                                },
                              }}
                            >
                              <Checkbox checked={isSelected} />
                              <ListItemText
                                disableTypography
                                primary={
                                  <Stack direction="row" alignItems="center">
                                    {section.icon && (
                                      <Box
                                        component="span"
                                        sx={{
                                          alignItems: 'center',
                                          color: 'text.secondary',
                                          display: 'inline-flex',
                                          justifyContent: 'center',
                                          mr: 1,
                                        }}
                                      >
                                        {section.icon}
                                      </Box>
                                    )}
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      fontWeight={500}
                                    >
                                      {section.title}
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
                                  color={isSelected ? 'success' : 'warning'}
                                >
                                  {isSelected ? 'Si' : 'No'}
                                </SeverityPill>
                              </Typography>
                            </ListItem>
                          );
                        })}
                    </List>
                  </Box>
                </Scrollbar>
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
                    {loading ? 'Añadiendo rol…' : 'Añadir rol'}
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
