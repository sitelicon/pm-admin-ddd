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
import { midBannerApi } from '../../api/midbanner';
import { SketchPicker } from 'react-color';

export const BannerLayoutCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [hexadecimalBack, setHexadecimalBack] = useState('#000000');
  const [hexadecimalText, setHexadecimalText] = useState('#000000');

  const handleChangeColorHexText = (hex) => {
    setHexadecimalText(hex);
  };

  const handleChangeColorHexBack = (hex) => {
    setHexadecimalBack(hex);
  };

  const handleClose = () => {
    setName('');
    setHexadecimalBack('#000000');
    setHexadecimalText('#000000');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await midBannerApi.createMidBanner({
        title_admin: name,
        hex_background: hexadecimalBack,
        hex_title: hexadecimalText,
      });
      toast.success('Banner season creado correctamente');
      router.push(`/admin-content/home/midbanner/${response.id}`);
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
                  Crear Season Banner
                </Typography>

                <TextField
                  fullWidth
                  label="Nombre interno"
                  variant="filled"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  sx={{ my: 2 }}
                />
              </Box>
              <Stack
                direction={'row'}
                alignContent={'center'}
                gap={2}
                justifyContent={'space-between'}
              >
                <Box textAlign={'center'}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Color de fondo
                  </Typography>
                  <SketchPicker
                    color={hexadecimalBack}
                    disableAlpha
                    onChange={({ hex }) => handleChangeColorHexBack(hex)}
                    onChangeComplete={({ hex }) =>
                      handleChangeColorHexBack(hex)
                    }
                  />
                </Box>
                <Box textAlign={'center'}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Color de texto
                  </Typography>
                  <SketchPicker
                    color={hexadecimalText}
                    disableAlpha
                    onChange={({ hex }) => handleChangeColorHexText(hex)}
                    onChangeComplete={({ hex }) =>
                      handleChangeColorHexText(hex)
                    }
                  />
                </Box>
              </Stack>
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
