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
import { useState } from 'react';
import { useLanguages } from '../../hooks/use-languages';
import { helpCenterApi } from '../../api/help-center';
import { useRouter } from 'next/router';
import { QuillEditor } from '../../components/quill-editor';
import { useStores } from '../../hooks/use-stores';

export const CreateEditHelpCenterModal = ({ open, onClose }) => {
  const languages = useLanguages();
  const stores = useStores();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [order, setOrder] = useState('');
  const [active, setActive] = useState(0);
  const [slug, setSlug] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const handleForm = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const response = await helpCenterApi.createHelpCenter({
        title,
        subtitle,
        order,
        is_active: active,
        slug,
        language_id: language,
        store_id: selectedStore,
      });
      if (response) {
        onClose();
        router.push(`/help/${response.id}`);
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
                <Typography variant="h6">Agregar item</Typography>
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
                    El título aparecerá tanto en el listado del menú, como en la
                    cabecera del artículo
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <QuillEditor
                    onChange={setSubtitle}
                    placeholder="Escriba el subtítulo del artículo*"
                    sx={{ height: 300 }}
                    value={subtitle}
                  />
                  <FormHelperText>
                    El subtitulo aparecerá bajo el título en la cabecera del
                    artículo. Si no quieres subtitulo, añade un espacio, no
                    aparecerá nada.
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth variant="filled">
                  <TextField
                    fullWidth
                    label="Orden"
                    variant="filled"
                    value={order}
                    onChange={(event) => {
                      setOrder(event.target.value);
                    }}
                    type="number"
                    required
                  />
                  <FormHelperText>
                    Si hay más de un item en el mismo orden, se ordenarán
                    alfabéticamente según el título.
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <TextField
                    fullWidth
                    label="Path"
                    variant="filled"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
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
                    Recuerda que si deseas que aparezca en el help center, debes
                    añadir también /help/ al principio del nombre. Si es a otra
                    página, añade / al principio seguido del nombre de la
                    página.
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">
                    Tienda del item *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={language}
                    onChange={(event) => {
                      setSelectedStore(event.target.value);
                    }}
                    label="Idioma"
                    required
                  >
                    {stores.map((store) => (
                      <MenuItem value={store.id} key={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Selecciona la tienda en la que se mostrará el item.
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">
                    Idioma item *
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
                    Selecciona el idioma en el que se mostrará el item para la
                    tienda seleccionada anteriormente. Es una traducción.
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
                    Por defecto, el item se creará como oculto.
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
