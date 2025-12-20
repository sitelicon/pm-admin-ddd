import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DateTimePicker } from '@mui/x-date-pickers';
import { homeWebApi } from '../../api/home-web';

export const HomeSettings = ({ info }) => {
  const [data, setData] = useState({
    title: info.title,
    active: info.active,
    from_date: info.from_date,
    to_date: info.to_date,
    store_id: info.store_id,
  });

  useEffect(() => {
    setData({
      title: info.title,
      active: info.active,
      from_date: info.from_date,
      to_date: info.to_date,
      store_id: info.store_id,
    });
  }, [info]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await homeWebApi.updateHomeWeb(info.id, data);
      toast.success('Maquetación Web creado correctamente');
      router.push(`/home-web/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack className="w-full">
      <Box pl={2}>
        <Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Ajustes del Home"
                subheader="Cambia los diferentes ajustes del home, como las fechas de aparición o si está activo"
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Título"
                    type="text"
                    variant="filled"
                    value={data.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                    required
                    sx={{ my: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.active}
                        onChange={(e) =>
                          setData({ ...data, active: e.target.checked })
                        }
                      />
                    }
                    label={
                      data.active
                        ? 'Activo actualmente'
                        : 'Inactivo actualmente'
                    }
                    sx={{ my: 2 }}
                  />
                  <DateTimePicker
                    fullWidth
                    sx={{ my: 2 }}
                    format="dd/MM/yyyy HH:mm"
                    value={data.from_date ? new Date(data.from_date) : null}
                    onChange={(date) => setData({ ...data, from_date: date })}
                    label="Fecha de inicio"
                    timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
                  />
                  <DateTimePicker
                    fullWidth
                    format="dd/MM/yyyy HH:mm"
                    timeSteps={{ hours: 1, minutes: 1, seconds: 5 }}
                    value={data.to_date ? new Date(data.to_date) : null}
                    onChange={(date) => setData({ ...data, to_date: date })}
                    label="Fecha de finalización"
                    sx={{ my: 2 }}
                  />
                </Stack>
              </CardContent>
              <Stack direction="row" spacing={2} sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleUpdate}
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

export default HomeSettings;
