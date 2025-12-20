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
import { instagramLayoutApi } from '../../api/instagram-layout';
import { paths } from '../../paths';

export const InstagramLayoutCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [footer, setFooter] = useState('');

  const handleClose = () => {
    setName('');
    setTitle('');
    setFooter('');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await instagramLayoutApi.createInstagramLayout({
        name,
        title,
        footer,
      });
      toast.success('Maquetación Web creado correctamente');
      router.push(`${paths.adminContent.home.instagram}/${response.id}`);
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
                  label="Footer"
                  variant="filled"
                  value={footer}
                  onChange={(event) => setFooter(event.target.value)}
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

InstagramLayoutCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
