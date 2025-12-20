import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

export const BannerImageLayoutDeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
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
          <Paper elevation={12} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" sx={{ my: 2 }} align="center">
                ¿Estás segura de que quieres eliminar este artículo?
              </Typography>
            </Box>
            <Stack
              alignItems="center"
              direction="row"
              spacing={3}
              sx={{ mt: 4 }}
            >
              <Button color="inherit" fullWidth size="large" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleConfirm}
              >
                De acuerdo
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Modal>
  );
};

BannerImageLayoutDeleteConfirmModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
