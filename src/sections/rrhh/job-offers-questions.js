import { Stack, Button, Box, Grid, Typography } from '@mui/material';
import CardFormJob from '../../components/card-form-job';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { jobsFormsAPI } from '../../api/jobs-forms';
import { JobFormModal } from './job-form-modal';
import { JobFormModalUseForm } from './job-form-use-modal';

const useFormsJobs = (id) => {
  const [state, setState] = useState({
    loading: true,
    jobForms: [],
    error: undefined,
  });

  const getFormsJobs = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await jobsFormsAPI.getFormsByJobOfferId(id);
      setState((prevState) => ({ ...prevState, jobForms: response }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [id]);

  useEffect(
    () => {
      getFormsJobs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  return {
    loading: state.loading,
    jobForms: state.jobForms,
    refetch: getFormsJobs,
    error: state.error,
  };
};

export const JobOffersQuestions = () => {
  const { jobOfferId } = useParams();
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const { loading, jobForms, error, refetch } = useFormsJobs(jobOfferId);

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          gap={2}
          sx={{ mb: 3 }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ alignSelf: 'end' }}
            onClick={() => setOpenSelect(true)}
          >
            Añadir
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ alignSelf: 'end' }}
            onClick={() => setOpen(true)}
          >
            Crear cuestionario
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {loading && <Typography>Cargando...</Typography>}
          {error && <Typography>{error}</Typography>}
          {!loading && !jobForms.length && (
            <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
              <Typography variant="body2" color={'text.secondary'}>
                No hay cuestionarios personalizados para esta oferta. Agregue
                uno.
              </Typography>
            </Box>
          )}
          {jobForms &&
            !loading &&
            jobForms.map((jobForm) => (
              <Grid item xs={12} md={6} key={jobForm.id}>
                <CardFormJob
                  isoCode={jobForm.language.iso}
                  jobFormId={jobForm.id}
                  jobForm={jobForm}
                  information={jobForm.content_questions}
                  refetch={refetch}
                />
              </Grid>
            ))}
          <JobFormModal
            open={open}
            onClose={handleCloseModal}
            refetch={refetch}
            jobOfferId={jobOfferId}
          />
          <JobFormModalUseForm
            open={openSelect}
            onClose={() => setOpenSelect(false)}
            refetch={refetch}
            jobOfferId={jobOfferId}
          />
        </Grid>
      </Box>
    </Stack>
  );
};
