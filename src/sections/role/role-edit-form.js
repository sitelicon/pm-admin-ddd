import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { usersApi } from '../../api/users';
import { useRouter } from 'next/router';
import { paths } from '../../paths';
import { useSections } from '../../layouts/dashboard/config';
import { SeverityPill } from '../../components/severity-pill';
import { CheckSquare, Square, XSquare } from '@untitled-ui/icons-react';

export const RoleEditForm = ({ role, refetch }) => {
  const router = useRouter();
  const sections = useSections();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const loading = useMemo(() => updating || deleting, [updating, deleting]);
  const [name, setName] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [menus, setMenus] = useState([{ code: 'Inicio' }]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setCanEdit(role.can_edit);
      setMenus([{ code: 'Inicio' }, ...role.menus]);
    }
  }, [role]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (menus.length === 0) {
        toast.error('Debe seleccionar al menos una sección.');
        return;
      }

      try {
        setUpdating(true);
        await usersApi.updateRole(role.id, {
          name,
          menus,
          can_edit: canEdit,
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
    [role, name, menus, refetch, canEdit],
  );

  const handleDelete = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          '¿Estás seguro de eliminar este rol? Esta acción es irreversible.',
        ) === false
      ) {
        return;
      }
      try {
        setDeleting(true);
        await usersApi.deleteRole(role.id);
        toast.success('El rol se ha eliminado correctamente.');
        router.push(paths.accounts.roles.index);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el rol.');
      } finally {
        setDeleting(false);
      }
    },
    [role, router],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader
          title="Modificar datos del rol"
          subheader="Al modificar un rol, se cerrarán las sesiones activas de los usuarios que lo tengan asignado."
        />
        <CardContent sx={{ py: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
            <TextField
              type="text"
              label="Nombre del rol"
              sx={{ flexGrow: 1 }}
              margin="normal"
              onChange={(event) => setName(event.target.value)}
              value={name}
              disabled={loading}
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
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Gestionar permisos
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Seleccione a qué secciones tendrá acceso el rol.
              </Typography>
            </div>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                color="primary"
                variant="text"
                onClick={() => {
                  setMenus(
                    sections
                      .reduce((acc, section) => {
                        return [
                          ...acc,
                          ...section.items.map((item) => ({
                            title: item.title,
                            icon: item.icon,
                          })),
                        ];
                      }, [])
                      .map(({ title }) => ({ code: title })),
                  );
                }}
                disabled={loading}
                startIcon={
                  <SvgIcon>
                    <CheckSquare />
                  </SvgIcon>
                }
              >
                Seleccionar todos
              </Button>
              <Button
                color="warning"
                variant="text"
                onClick={() => {
                  setMenus([{ code: 'Inicio' }]);
                }}
                disabled={loading}
                startIcon={
                  <SvgIcon>
                    <Square />
                  </SvgIcon>
                }
              >
                Desmarcar todos
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
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
                    <Grid key={section.title} item xs={12} sm={6} md={4}>
                      <ListItem
                        onClick={() => {
                          if (section.title === 'Inicio') {
                            return;
                          }
                          return setMenus((prev) =>
                            prev.some(({ code }) => code === section.title)
                              ? prev.filter(
                                  ({ code }) => code !== section.title,
                                )
                              : [...prev, { code: section.title }],
                          );
                        }}
                        sx={{
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            cursor: 'pointer',
                          },
                        }}
                        disabled={section.title === 'Inicio'}
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
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
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

RoleEditForm.propTypes = {
  role: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
