import { useCallback, useState } from 'react';
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

export const ProductAddTagModal = ({ open, onClose, onConfirm, ...other }) => {
  const [value, setValue] = useState('');

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!value || value.trim().length === 0) return;
      onConfirm(value);
      setValue('');
      onClose();
    },
    [onClose, onConfirm, value],
  );

  return (
    <Modal
      {...other}
      open={open}
      onClose={onClose}
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
                <Typography variant="h6">Agregar etiqueta de imágen</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Las etiquetas son palabras clave que ayudan a organizar las
                  imágenes del producto en la tienda online. Estas nunca se
                  mostrarán en la tienda online a los clientes.
                </Typography>
                <TextField
                  autoFocus
                  fullWidth
                  label="Etiqueta"
                  onChange={(event) => setValue(event.target.value)}
                  select
                  SelectProps={{ native: true }}
                  value={value}
                  variant="filled"
                  required
                >
                  <option value="" disabled />
                  <option value="PRINCIPAL">PRINCIPAL</option>
                  <option value="THUMBNAIL">THUMBNAIL</option>
                  <option value="CROQUIS">CROQUIS</option>
                  <option value="CARACTERÍSTICAS">CARACTERÍSTICAS</option>
                </TextField>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button color="inherit" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                    Agregar
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
