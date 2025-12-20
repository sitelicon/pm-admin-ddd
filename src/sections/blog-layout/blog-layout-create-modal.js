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
import { blogLayoutApi } from '../../api/blog-layout';
import { paths } from '../../paths';

export const BlogLayoutCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('text');

  const handleClose = () => {
    setName('');
    setType('flex');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await blogLayoutApi.createBlogLayout({
        name,
        type,
      });
      toast.success('Maquetación Web creado correctamente');
      router.push(`${paths.adminContent.home.blogs}/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const typeOptions = ['flex', 'grid'];

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
                  Crear Diseño del control deslizante
                </Typography>

                <TextField
                  fullWidth
                  label="Name"
                  variant="filled"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
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

BlogLayoutCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
