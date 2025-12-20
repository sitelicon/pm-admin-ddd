import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  FormLabel,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';

import { landingPageApi } from '../../api/landing-page';
import { useStores } from '../../hooks/use-stores';

export const LandingPageCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [storeId, setStoreId] = useState(1);
  const stores = useStores();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleClose = () => {
    setIsActive(true);
    setTitle('');
    setUrl('');
    setFrom('');
    setTo('');
    onClose();
  };

  const handleCreateLanding = async (event) => {
    event.preventDefault();

    // Validación de fechas
    if (new Date(from) > new Date(to)) {
      toast.error('La fecha Desde no puede ser mayor que la fecha Hasta.');
      return;
    }

    try {
      const response = await landingPageApi.createLandingPage({
        active: isActive,
        store_id: storeId,
        title: title,
        url: url,
        from: from, // Incluyendo la fecha de inicio
        to: to, // Incluyendo la fecha de fin
      });
      toast.success('Landing Page creada correctamente.');
      router.push(`/landing-page/${response.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la Landing Page.'); // Mensaje de error si falla la API
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
        <Container>
          <form onSubmit={handleCreateLanding}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Añadir Nueva Landing Page
                </Typography>

                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Título
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Url
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="url"
                    type="text" // Cambiado a tipo URL
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Fecha Desde
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="from"
                    type="date" // Tipo de fecha
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                    InputLabelProps={{ shrink: true }} // Para que la etiqueta se mantenga arriba
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Fecha Hasta
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="to"
                    type="date" // Tipo de fecha
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    InputLabelProps={{ shrink: true }} // Para que la etiqueta se mantenga arriba
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Tienda
                  </FormLabel>
                  <Select
                    fullWidth
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                  >
                    {stores.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(event, checked) => setIsActive(checked)}
                    />
                  }
                  label="Activado"
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
                  Añadir
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

LandingPageCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
