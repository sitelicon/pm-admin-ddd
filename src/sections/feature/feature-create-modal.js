import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { productsApi } from '../../api/products';
import { featuresApi } from '../../api/features';

export const FeatureCreateModal = ({ open, onClose, onConfirm, ...other }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose?.();
    setName('');
  }, [onClose]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (name.trim() === '') return;
      try {
        setLoading(true);
        await featuresApi.createFeature({ name });
        toast.success('La característica se ha creado correctamente.');
        onConfirm?.();
        handleClose();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo crear la característica.');
      } finally {
        setLoading(false);
      }
    },
    [onConfirm, handleClose, name],
  );

  return (
    <Modal
      {...other}
      open={open}
      onClose={handleClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...(other.sx || {}),
      }}
    >
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h5">Crear característica</Typography>
                <Typography color="text.secondary" variant="body2">
                  Introduzca el nombre de la característica que desea crear.
                  Este nombre sólo será visible para los administradores, no
                  para los clientes.
                </Typography>
                <TextField
                  fullWidth
                  label="Nombre"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  variant="outlined"
                />
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button color="inherit" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading || name.trim() === ''}
                  >
                    {loading
                      ? 'Añadiendo característica…'
                      : 'Añadir característica'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};
