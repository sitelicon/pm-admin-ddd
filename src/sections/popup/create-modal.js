import { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Modal,
  Box,
  Paper,
  Container,
  Stack,
  TextField,
  FormHelperText,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import { useLanguages } from '../../hooks/use-languages';
import { popupsApi } from '../../api/popups';

export const CreateEditPopupModal = ({ open, onClose }) => {
  const languages = useLanguages();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [active, setActive] = useState(0);
  const [path, setPath] = useState('');
  const [language, setLanguage] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleForm = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const response = await popupsApi.createPopUp({
        title,
        to: moment(to).format('YYYY-MM-DD HH:mm:ss'),
        from: moment(from).format('YYYY-MM-DD HH:mm:ss'),
        is_active: active,
        path,
        language_id: language,
      });
      if (response) {
        onClose();
        router.push(`/popups/${response.id}`);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setUpdating(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <form onSubmit={handleForm}>
          <Paper elevation={12} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Agregar popup</Typography>
                <FormControl fullWidth variant="filled">
                  <TextField
                    fullWidth
                    label="Titulo"
                    variant="filled"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    required
                  />
                  <FormHelperText>
                    El título es interno, no se mostrará en la web.
                  </FormHelperText>
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
                <FormControl fullWidth variant="filled">
                  <TextField
                    fullWidth
                    label="Path"
                    variant="filled"
                    value={path}
                    onChange={(event) => {
                      setPath(event.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          pacomartinez.com
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                  <FormHelperText>
                    Añade / al principio seguido del nombre de la página.
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">
                    Tienda *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={language}
                    onChange={(event) => {
                      setLanguage(event.target.value);
                    }}
                    label="Idioma"
                    required
                  >
                    {languages.map((language) => (
                      <MenuItem value={language.id} key={language.id}>
                        {language.language}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Selecciona la tienda donde aparecerá el popup
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">
                    Visibilidad
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={active}
                    onChange={(event) => {
                      setActive(event.target.value);
                    }}
                    label="Visibilidad"
                    required
                  >
                    <MenuItem value={0}>Oculto</MenuItem>
                    <MenuItem value={1}>Visible</MenuItem>
                  </Select>
                  <FormHelperText>
                    Por defecto, el popup se creará como oculto.
                  </FormHelperText>
                </FormControl>
                <Typography variant="body2" color="error">
                  {error?.message}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={updating}
                >
                  {updating ? 'Creando...' : 'Crear'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </form>
      </Container>
    </Modal>
  );
};
