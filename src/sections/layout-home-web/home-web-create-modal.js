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
  FormControlLabel,
  Switch,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { homeWebApi } from '../../api/home-web';
import { DateTimePicker } from '@mui/x-date-pickers';

export const HomeWebCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [data, setData] = useState({
    title: '',
    active: 1,
    from_date: '',
    to_date: '',
  });

  const handleClose = () => {
    setData({
      title: '',
      active: 1,
      from_date: '',
      to_date: '',
    });
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await homeWebApi.createHomeWeb(data);
      toast.success('Maquetación Web creado correctamente');
      router.push(`/home-web/${response.id}`);
    } catch (error) {
      console.error(error);
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
      <Box sx={{ width: 560 }}>
        <Container maxWidth="sm">
          <form onSubmit={handleCreateProduct}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Crear home
                </Typography>

                <TextField
                  fullWidth
                  label="Título"
                  type="text"
                  variant="filled"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
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
                    data.active ? 'Activo actualmente' : 'Inactivo actualmente'
                  }
                  sx={{ my: 2 }}
                />
                <DateTimePicker
                  fullWidth
                  sx={{ my: 2 }}
                  // format="dd/MM/yyyy"
                  value={data.from_date ? new Date(data.from_date) : null}
                  onChange={(date) => setData({ ...data, from_date: date })}
                  label="Fecha de inicio"
                />
                <DateTimePicker
                  fullWidth
                  // format="dd/MM/yyyy"
                  value={data.to_date ? new Date(data.to_date) : null}
                  onChange={(date) => setData({ ...data, to_date: date })}
                  label="Fecha de finalización"
                  sx={{ my: 2 }}
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

HomeWebCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
