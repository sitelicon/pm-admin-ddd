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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { helpCenterApi } from '../../api/help-center';
import { QuillEditor } from '../../components/quill-editor';

export const CreateEditHelpCenterItemModal = ({
  open,
  onClose,
  refetch,
  data,
}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [order, setOrder] = useState('');
  const [active, setActive] = useState(0);
  const [language, setLanguage] = useState(data?.language_id || '');
  const [help_center_id, setHelpCenterId] = useState(
    data?.help_center_id || '',
  );

  useEffect(() => {
    if (data) {
      setLanguage(data.language_id);
      setHelpCenterId(data.help_center_id);
    }
  }, [data]);

  const handleForm = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const response = await helpCenterApi.createHelpCenterItem({
        title,
        subtitle,
        order,
        is_open_default: active === 1 ? true : false,
        help_center_id,
        language_id: language,
      });
      if (response) {
        onClose();
        refetch();
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
                <Typography variant="h6">Agregar contenedor</Typography>
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
                    El título aparecerá en la cabecera del contenedor.
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
                    El subtitulo aparecerá al abrir el contenedor.
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
                  <InputLabel id="demo-simple-select-filled-label">
                    ¿Está abierto por defecto?
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
                    <MenuItem value={0}>Cerrado</MenuItem>
                    <MenuItem value={1}>Abierto</MenuItem>
                  </Select>
                  <FormHelperText>
                    Por defecto, el item se creará como cerrado.
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
