import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Modal, Dialog, Paper, Typography, Button } from '@mui/material';
import { Box, Container, Stack, fontFamily } from '@mui/system';
import { useMediaQuery } from '@uidotdev/usehooks';

export const ModalVisualizerJobOffer = ({ open, onClose, jobOfferData }) => {
  const [error, setError] = useState(undefined);
  const handleClose = () => {
    onClose();
  };

  const toSalary = (salary) => {
    // Convierte el salario a número y formatea con punto para los miles
    const numberFormat = Number(salary).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });

    return numberFormat.replace(/(\.\d{2})0*$/, '$1');
  };

  return (
    <Dialog scroll="body" open={open} onClose={onClose} maxWidth="xl">
      <Paper elevation={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
          }}
        >
          <Box>
            <Box justifyItems={'center'} justifyContent={'center'}>
              <Box justifyItems={'center'} justifyContent={'center'}>
                <Box
                  alignItems={'center'}
                  justifyContent={'center'}
                  justifyItems={'center'}
                  textAlign={'center'}
                >
                  <Stack direction="column" alignItems="center">
                    <Typography
                      variant="h2"
                      style={{ fontFamily: 'sans-serif', paddingTop: 32 }}
                    >
                      {jobOfferData?.position_name}
                    </Typography>
                    <Typography variant="h5" className="text-xl">
                      {jobOfferData?.physical_store?.name ??
                        jobOfferData.store_name}{' '}
                      ·{' '}
                      {jobOfferData?.physical_store?.city
                        ? jobOfferData?.physical_store?.city
                        : jobOfferData?.store_city}
                    </Typography>
                    <Typography variant="h6">
                      {jobOfferData?.position_journal_type_job === 'complete'
                        ? 'Jornada completa'
                        : ''}
                      {jobOfferData?.position_journal_type_job === 'partial'
                        ? 'Jornada parcial'
                        : ''}
                    </Typography>
                    <Typography variant="h6" className="text-xl">
                      {jobOfferData?.salary_visibility
                        ? toSalary(jobOfferData?.salary_expectations) +
                          ' ' +
                          'anuales'
                        : ''}{' '}
                    </Typography>
                  </Stack>

                  <Button
                    className="text-white"
                    sx={{
                      marginTop: '2rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      padding: '0.5rem 2rem',
                      color: 'white',
                      backgroundColor: 'black!important',
                      borderRadius: '0',
                    }}
                  >
                    ENVIAR SOLICITUD
                  </Button>
                </Box>
              </Box>
              <Box
                mt={10}
                py={16}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor={'#F5F5F5'}
                gap={10}
                width="100%"
              >
                <Stack
                  direction="column"
                  width={{
                    xs: '100%',
                    md: '80%',
                    lg: '60%',
                  }}
                  gap={2}
                >
                  <Typography
                    variant="h6"
                    className="font-semibold tracking-wider"
                  >
                    DESCRIPCIÓN
                  </Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: jobOfferData?.position_description,
                    }}
                  />
                </Stack>
                <Stack
                  direction="column"
                  width={{
                    xs: '100%',
                    md: '80%',
                    lg: '60%',
                  }}
                  gap={2}
                >
                  <Typography
                    variant="h6"
                    className="font-semibold tracking-wider"
                  >
                    REQUISITOS
                  </Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: jobOfferData?.position_requisits,
                    }}
                  />
                </Stack>
                <Stack
                  direction="column"
                  width={{
                    xs: '100%',
                    md: '80%',
                    lg: '60%',
                  }}
                  gap={2}
                >
                  <Typography
                    variant="h6"
                    className="font-semibold tracking-wider"
                  >
                    QUÉ TE APORTAREMOS
                  </Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: jobOfferData?.positions_benefits,
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        <Stack alignItems="center" direction="row">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: '0' }}
            size="large"
            onClick={handleClose}
          >
            Volver
          </Button>
        </Stack>
      </Paper>
    </Dialog>
  );
};

ModalVisualizerJobOffer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  jobOfferData: PropTypes.object,
};
