import { useCallback, useState } from 'react';
import { SketchPicker } from 'react-color';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { colorsApi } from '../../api/colors';
import { toast } from 'react-hot-toast';

const tenants = [
  { id: 1, label: '🇪🇸 Español' },
  { id: 2, label: '🇬🇧 Inglés' },
  { id: 4, label: '🇵🇹 Portugués' },
  { id: 5, label: '🇮🇹 Italiano' },
  { id: 3, label: '🇫🇷 Francés' },
  { id: 7, label: '🇵🇹(M)' },
];

const ColorDetails = ({ language, colorLanguage, color, refetch }) => {
  const [colorUpdate, setColorUpdate] = useState(
    colorLanguage?.label ? colorLanguage?.label : '',
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const tenantAvailable = tenants.find((t) => t.id === language.id);

  const handleUpdateLabel = useCallback(async () => {
    try {
      setIsUpdating(true);
      await colorsApi.updateColorLabelAdmin({
        id: color[0].id,
        languages_id: language.id,
        label: colorUpdate,
      });
      toast.success('Color actualizado');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el color');
    } finally {
      setIsUpdating(false);
    }
  }, [color, colorUpdate, language, refetch]);

  return (
    <Grid item key={language.id} xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">{tenantAvailable.label}</Typography>
            </Stack>
            <Divider />
            <TextField
              fullWidth
              label="Nombre"
              type="text"
              value={colorUpdate}
              onChange={(e) => setColorUpdate(e.target.value)}
            />
          </Stack>
        </CardContent>
        <Stack direction="row" justifyContent="center" spacing={2} p={3}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={handleUpdateLabel}
            disabled={isUpdating}
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar color'}
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
};

export const ColorsDetails = ({ color, refetch }) => {
  const [nameAdmin, setNameAdmin] = useState(color[0].name_admin);
  const [hexadecimal, setHexadecimal] = useState(color[0].hexadecimal);
  const [isUpdatingHex, setIsUpdatingHex] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleUpdateName = useCallback(async () => {
    try {
      setIsUpdatingName(true);
      await colorsApi.updateColorNameAdmin({
        id: color[0].id,
        name_admin: nameAdmin,
      });
      toast.success('Color actualizado');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el color');
    } finally {
      setIsUpdatingName(false);
    }
  }, [color, nameAdmin, refetch]);

  const handleChangeColorHex = (hex) => {
    setHexadecimal(hex);
  };

  const handleUpdateColorHex = useCallback(async () => {
    try {
      setIsUpdatingHex(true);
      await colorsApi.updateColorHex({
        id: color[0].id,
        hexadecimal: hexadecimal,
      });
      toast.success('Color actualizado');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el color');
    } finally {
      setIsUpdatingHex(false);
    }
  }, [color, hexadecimal, refetch]);

  return (
    <Stack spacing={2}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Color"
                subheader="Selecciona el valor hexadecimal del color. Puedes seleccionarlo mediante la rueda o directamente poniendo su valor."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={1} direction={'row'}>
                  <Box>
                    <SketchPicker
                      color={hexadecimal}
                      disableAlpha
                      onChange={({ hex }) => handleChangeColorHex(hex)}
                      onChangeComplete={({ hex }) => handleChangeColorHex(hex)}
                    />
                  </Box>
                  <Stack direction={'column'} className="w-1/2" spacing={2}>
                    <Box
                      className="w-full"
                      sx={{
                        backgroundColor: `${hexadecimal}`,
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        display: 'flex',
                        height: 100,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Hexadecimal"
                      type="text"
                      value={hexadecimal.toUpperCase()}
                      onChange={({ target }) =>
                        setHexadecimal(target.value.toUpperCase())
                      }
                    />
                    <Stack
                      className="w-full"
                      direction="row"
                      justifyContent="center"
                      spacing={1}
                      p={3}
                    >
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={handleUpdateColorHex}
                        disabled={isUpdatingHex}
                      >
                        {isUpdatingHex ? 'Actualizando...' : 'Actualizar'}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Información"
                subheader="Podrás cambiar el nombre del color para administración."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
              />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Nombre Administración"
                  type="text"
                  value={nameAdmin}
                  onChange={({ target }) => setNameAdmin(target.value)}
                />
              </CardContent>
              <Stack direction="row" justifyContent="center" spacing={1} p={3}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={handleUpdateName}
                  disabled={isUpdatingName}
                >
                  {isUpdatingName ? 'Actualizando...' : 'Actualizar nombre'}
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h6">Nombres por lenguaje</Typography>
              <Typography color="text.secondary" variant="body2">
                Gestione los nombres del color para cada uno de los idiomas
                online.
              </Typography>
            </Stack>
            <Divider />
            <Box>
              <Grid container spacing={2}>
                {tenants.map((language) => {
                  const colorData = color[0].colordata.find(
                    (c) => c.languages_id === language.id,
                  );

                  return (
                    <ColorDetails
                      key={language.id}
                      language={language}
                      colorLanguage={colorData}
                      color={color}
                      refetch={refetch}
                    />
                  );
                })}
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
