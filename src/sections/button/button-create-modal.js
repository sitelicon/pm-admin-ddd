import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { buttonApi } from '../../api/button';
import { paths } from '../../paths';
import { useStores } from '../../hooks/use-stores';

export const ButtonCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('text');
  const [languajeSelected, setLanguajeSelected] = useState(1);
  const stores = useStores();

  const handleClose = () => {
    setTitle('');
    setType('flex');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await buttonApi.createButton({
        title,
        url,
        type,
        language_id: languajeSelected,
      });
      toast.success('Botón creado correctamente');
      router.push(`${paths.adminContent.home.buttons}/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const typeOptions = ['button', 'link'];

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
      <Box sx={{ width: 560 }}>
        <Container maxWidth="sm">
          <form>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Crear Diseño del control deslizante
                </Typography>

                <TextField
                  fullWidth
                  label="Title"
                  variant="filled"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  sx={{ my: 2 }}
                />
                <TextField
                  fullWidth
                  label="Url"
                  variant="filled"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  sx={{ my: 2 }}
                />
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Lenguaje
                  </FormLabel>
                  <Select
                    fullWidth
                    value={languajeSelected}
                    onChange={(e) => setLanguajeSelected(e.target.value)}
                  >
                    {stores.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Tipo
                  </FormLabel>
                  <Select
                    fullWidth
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {typeOptions.map((item, index) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
                sx={{ mt: 4 }}
              >
                <Button
                  color="inherit"
                  fullWidth
                  size="large"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  onClick={handleCreateProduct}
                >
                  Crear
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

ButtonCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
