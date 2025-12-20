import {
  Modal,
  Box,
  Paper,
  Container,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { jobsFormsAPI } from '../../api/jobs-forms';

const useFormsJobs = () => {
  const [state, setState] = useState({
    loading: true,
    jobForms: [],
    error: undefined,
  });

  const getFormsJobs = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await jobsFormsAPI.getJobOfferForms();
      setState((prevState) => ({ ...prevState, jobForms: response }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(
    () => {
      getFormsJobs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    loading: state.loading,
    forms: state.jobForms,
    refetch: getFormsJobs,
    error: state.error,
  };
};

export const JobFormModalUseForm = ({ open, onClose, jobOfferId, refetch }) => {
  const { forms } = useFormsJobs();
  const [selectedForm, setSelectedForm] = useState('');
  const handleForm = async (event) => {
    event.preventDefault();
    try {
      await jobsFormsAPI
        .associateJobOfferForms(selectedForm, {
          job_offer_id: jobOfferId,
        })
        .then(() => {
          onClose();
          refetch();
        });
    } catch (error) {
      console.log(error);
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
      <Container maxWidth="sm">
        <form onSubmit={handleForm}>
          <Paper elevation={12} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Selecciona cuestionario</Typography>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Formularios disponibles
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedForm}
                    label="Formularios disponibles"
                    onChange={(event) => {
                      setSelectedForm(event.target.value);
                    }}
                  >
                    {forms.map((form, index) => (
                      <MenuItem key={index} value={form.id}>
                        {form.name} ({form.language.language})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">
                  Usar
                </Button>
              </Stack>
            </Box>
          </Paper>
        </form>
      </Container>
    </Modal>
  );
};
