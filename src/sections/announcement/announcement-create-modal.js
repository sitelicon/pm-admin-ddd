import { useState } from 'react';
import toast from 'react-hot-toast';
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
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { announcementsApi } from '../../api/announcements';
import { useLanguages } from '../../hooks/use-languages';

export const AnnouncementCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const [language, setLanguage] = useState();
  const [error, setError] = useState(undefined);
  const [message, setMessage] = useState();
  const languages = useLanguages();
  const [isActive, setIsActive] = useState(false);

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await announcementsApi.createAnnouncement({
        language_id: language,
        is_active: isActive,
        message,
      });
      toast.success('Anuncio creado correctamente');
      setError(undefined);
      router.push(`/announcements/${response.id}`);
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
                  Crear anuncio
                </Typography>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Lenguaje
                  </FormLabel>
                  <Select
                    fullWidth
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {languages.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  error={!!error}
                  fullWidth
                  label="Mensaje"
                  margin="normal"
                  variant="filled"
                  value={message}
                  multiline
                  onChange={(event) => setMessage(event.target.value)}
                  helperText={error || 'El mensaje es obligatorio'}
                  required
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(event, checked) => setIsActive(checked)}
                    />
                  }
                  label="Visibilidad"
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

AnnouncementCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
