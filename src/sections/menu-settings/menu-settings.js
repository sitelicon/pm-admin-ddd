import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { menuSettingsApi } from '../../api/menu-settings';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useSettingsMenu = (store) => {
  const [formValues, setFormValues] = useState({
    active_background_color: false,
    background_color: '',
    text_color: '',
    id: null,
    store_id: store.store,
    home_web_id: store.selectedHome,
  });

  const getFormValues = useCallback(async () => {
    try {
      const res = await menuSettingsApi.getMenuSettingStore(
        store.store,
        store.selectedHome,
      );
      setFormValues({
        active_background_color: res.active_background_color ?? false,
        background_color: res.background_color ?? '',
        text_color: res.text_color ?? '',
        id: res.id ?? null,
        store_id: res.store_id ?? store.store,
        home_web_id: res.home_web_id ?? store.selectedHome,
      });
    } catch (error) {
      console.error(error);
    }
  }, [store]);

  const updateMenuSettings = useCallback(async () => {
    try {
      await menuSettingsApi.updateMenuSetting(formValues.id, formValues);
      toast.success('Ajustes del menú actualizados correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar los ajustes del menú');
    }
  }, [formValues]);

  const createMenuSettings = useCallback(async () => {
    try {
      await menuSettingsApi.createMenuSetting(formValues);
      toast.success('Ajustes del menú creados correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear los ajustes del menú');
    }
  }, [formValues]);

  useEffect(() => {
    getFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return {
    state: formValues,
    setState: setFormValues,
    updateMenuSettings,
    createMenuSettings,
  };
};

export const MenuSettings = (store, id) => {
  const { state, setState, updateMenuSettings, createMenuSettings } =
    useSettingsMenu(store, id);

  const handleCreateOrUpdate = () => {
    if (state.id) {
      updateMenuSettings();
    } else {
      createMenuSettings();
    }
  };

  return (
    <Stack className="w-full">
      <Box pl={2}>
        <Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Ajustes del menú"
                subheader="Cambia los diferentes ajustes del menú general. Usa siempre valores hexadecimales para los colores."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2">
                        Se ve el fondo:{' '}
                        {state.active_background_color
                          ? 'Sí'
                          : 'No, es transparente'}
                      </Typography>
                      <Switch
                        color="primary"
                        edge="start"
                        checked={state.active_background_color}
                        onChange={(event) => {
                          setState((prevState) => ({
                            ...prevState,
                            active_background_color: event.target.checked,
                          }));
                        }}
                      />
                    </Stack>
                  </Box>
                  <TextField
                    fullWidth
                    label="Color del fondo"
                    variant="filled"
                    value={state.background_color}
                    onChange={(event) => {
                      setState((prevState) => ({
                        ...prevState,
                        background_color: event.target.value,
                      }));
                    }}
                    required
                    sx={{ my: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Color de iconos"
                    variant="filled"
                    value={state.text_color}
                    onChange={(event) => {
                      setState((prevState) => ({
                        ...prevState,
                        text_color: event.target.value,
                      }));
                    }}
                    required
                    sx={{ my: 2 }}
                  />
                </Stack>
              </CardContent>
              <Stack direction="row" spacing={2} sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleCreateOrUpdate}
                  disabled={false}
                >
                  Guardar
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default MenuSettings;
