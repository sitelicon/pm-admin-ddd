import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Modal, Paper, Typography, Button } from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { jobsOfferAPI } from '../../api/jobs-offers';

export const JobOffersCloneModal = ({ open, onClose, jobOffer }) => {
  const router = useRouter();
  const [error, setError] = useState(undefined);

  const handleClose = () => {
    onClose();
  };

  const handleJobOfferClone = async (event) => {
    event.preventDefault();
    try {
      const response = await jobsOfferAPI.cloneJobOffer(jobOffer.id);
      toast.success('Oferta de trabajo clonada correctamente');
      setError(undefined);
      router.push(`/rrhh/${response.id}`);
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
          <form onSubmit={handleJobOfferClone}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography variant="h5">
                  Clonar la oferta de trabajo
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  La oferta de trabajo se clonará, y se creará una nueva oferta,
                  con los mismos datos, pero con un nuevo ID. Se generará con la
                  visibilidad desactivada. Una vez creada, podrás editarla y
                  activarla.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                {error && (
                  <Typography color="error" variant="body2">
                    {error.message}
                  </Typography>
                )}
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
                  Crear clonación
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

JobOffersCloneModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  jobOffer: PropTypes.object,
};
