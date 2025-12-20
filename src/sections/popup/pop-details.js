import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormLabel,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { languagesApi } from '../../api/languages';
import { popupsApi } from '../../api/popups';

const useLang = () => {
  const [state, setState] = useState({
    languages: [],
    loadingLanguages: true,
  });

  const getLanguages = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: true,
      }));

      const res = await languagesApi.getLanguages();

      setState({
        languages: res,
        loadingLanguages: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: false,
      }));
    }
  };

  useEffect(() => {
    getLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

export const PopupsDetails = ({ item, refetch }) => {
  const { languages } = useLang();
  const [title, setTitle] = useState(item.title);
  const [from, setFrom] = useState(new Date(item.from) ?? null);
  const [to, setTo] = useState(new Date(item.to) ?? null);
  const [is_active, setIs_active] = useState(item.is_active);
  const [path, setPath] = useState(item.path);
  const [language_id, setLanguage_id] = useState(item.language_id);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const handleUpdateDetails = async () => {
    try {
      setUpdating(true);
      await popupsApi.updatePopUp(item.id, {
        title,
        is_active,
        from: moment(from).format('YYYY-MM-DD HH:mm:ss'),
        to: moment(to).format('YYYY-MM-DD HH:mm:ss'),
        path,
        language_id,
      });
      toast.success('Detalles actualizados');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No fue posible actualizar los detalles');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        {error.state && (
          <Grid container justifyContent="center">
            <Grid>
              <Box sx={{ color: 'error.main' }}>{error.message}</Box>
            </Grid>
          </Grid>
        )}
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Card>
                <CardHeader
                  title="Detalles del popup"
                  subheader="Agrega y edita detalles del popup"
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Título interno del popup"
                      name="title"
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      value={title}
                      variant="outlined"
                    />
                    <TextField
                      label="Dirección de la página"
                      name="path"
                      onChange={(e) => setPath(e.target.value)}
                      required
                      value={path}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            pacomartinez.com
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Idioma</InputLabel>
                      {languages && (
                        <Select
                          value={language_id}
                          label="Idioma"
                          onChange={(event) =>
                            setLanguage_id(event.target.value)
                          }
                        >
                          <MenuItem key={0} value={''}>
                            Selecciona un idioma
                          </MenuItem>
                          {languages.map((language) => (
                            <MenuItem key={language.id} value={language.id}>
                              {language.language}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <DateTimePicker
                      clearable
                      format="dd/MM/yyyy HH:mm"
                      label="Aplicar a partir de"
                      name="from"
                      onChange={(value) => setFrom(value)}
                      renderInput={(params) => <TextField {...params} />}
                      value={from}
                    />
                    <DateTimePicker
                      clearable
                      format="dd/MM/yyyy HH:mm"
                      label="Aplicar hasta"
                      name="to"
                      onChange={(value) => setTo(value)}
                      renderInput={(params) => <TextField {...params} />}
                      value={to}
                    />
                    <FormControl>
                      <FormLabel sx={{ ml: 1 }} component="legend">
                        Estado del popup
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{ ml: 1 }}
                            checked={is_active > 0}
                            onChange={(event) => {
                              setIs_active(event.target.checked ? 1 : 0);
                            }}
                            name="is_active"
                          />
                        }
                        label={is_active > 0 && 'Popup activo'}
                      />
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container justifyContent="center">
              <Grid>
                <Button
                  sx={{ minWidth: 300 }}
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateDetails}
                  disabled={updating}
                >
                  {updating ? 'Actualizando...' : 'Actualizar detalles'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};
