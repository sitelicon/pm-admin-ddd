import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { colorsApi } from '../../api/colors';

export const ColorCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [name_admin, setName_admin] = useState('');
  const [hexadecimal, setHexadecimal] = useState('#');
  const [languages_id, setLanguages_id] = useState(1);
  const [label, setLabel] = useState('');
  const [error, setError] = useState(undefined);

  const handleClose = () => {
    setName_admin('');
    setHexadecimal('');
    setLanguages_id('');
    setLabel('');
    onClose();
  };

  const handleCreateColor = async (event) => {
    event.preventDefault();
    try {
      const response = await colorsApi.createColor({
        name_admin,
        hexadecimal,
        languages_id,
        label,
      });
      toast.success('Color creado correctamente');
      setError(undefined);
      setName_admin('');
      setHexadecimal('');
      setLanguages_id('');
      setLabel('');
      router.push(`/colors/${response.color.id}`);
    } catch (error) {
      setError(error.message);
    }
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
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleCreateColor}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5">Crear color</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  El color se creará en <strong>español</strong>. Podrás editar
                  el color en cualquier momento para completar su información y
                  mostrar otras traducciones.
                </Typography>
                <TextField
                  error={!!error}
                  fullWidth
                  label="Introduce el nombre de administración del color"
                  margin="normal"
                  variant="filled"
                  value={name_admin}
                  onChange={(event) => setName_admin(event.target.value)}
                  helperText={
                    error || 'El nombre de administración del color es único'
                  }
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Introduce el valor hexadecimal del color"
                  margin="normal"
                  variant="filled"
                  value={hexadecimal}
                  onChange={(event) => setHexadecimal(event.target.value)}
                  helperText={
                    error ||
                    'Recuerda que debe ser un valor hexadecimal válido con el formato #000000'
                  }
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Introduce el label del color."
                  margin="normal"
                  variant="filled"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  helperText={
                    error || 'Este es el nombre que se mostrará en la tienda'
                  }
                  required
                />
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
                >
                  Crear color
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

ColorCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
