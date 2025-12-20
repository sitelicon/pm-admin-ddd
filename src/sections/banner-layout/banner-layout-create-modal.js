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
import { bannerTextLayoutApi } from '../../api/banner-layout';
import { paths } from '../../paths';

export const BannerLayoutCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('text');

  const handleClose = () => {
    setName('');
    setType('text');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await bannerTextLayoutApi.createBannerTextLayout({
        name,
        type,
      });
      toast.success('Maquetación Web creado correctamente');
      router.push(`${paths.adminContent.home.bannerText}/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const typeOptions = ['text', 'images'];

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

BannerLayoutCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
