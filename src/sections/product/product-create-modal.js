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
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import PropTypes from 'prop-types';
import { productsApi } from '../../api/products';
import { useRouter } from 'next/navigation';

export const ProductCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [sku, setSku] = useState('');
  const [error, setError] = useState(undefined);

  const handleClose = () => {
    setSku('');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await productsApi.createProduct({
        sku,
      });
      toast.success('Producto creado correctamente');
      setError(undefined);
      setSku('');
      router.push(`/products/${response.id}`);
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
          <form onSubmit={handleCreateProduct}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5">Crear producto</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  El producto se creará en modo <strong>deshabilitado</strong>.
                  Podrás editar el producto en cualquier momento para completar
                  su información y habilitarlo en las tiendas.
                </Typography>
                <TextField
                  error={!!error}
                  fullWidth
                  label="Introduce el SKU del producto"
                  margin="normal"
                  variant="filled"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  helperText={
                    error || 'El SKU es un identificador único del producto'
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
                  Crear producto
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

ProductCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
