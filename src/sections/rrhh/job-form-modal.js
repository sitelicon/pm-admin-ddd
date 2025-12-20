import {
  Modal,
  Box,
  Paper,
  Container,
  Stack,
  TextField,
  FormHelperText,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { jobsFormsAPI } from '../../api/jobs-forms';

export const JobFormModal = ({ open, onClose, jobOfferId, refetch }) => {
  const [name, setName] = useState('');
  const [language, setLanguaje] = useState('');

  const handleForm = async (event) => {
    event.preventDefault();
    try {
      await jobsFormsAPI
        .createJobForms({
          name,
          language_id: language,
          job_offer_id: jobOfferId,
          content_questions: JSON.stringify([]),
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
                <Typography variant="h6">Agregar cuestionario</Typography>
                <FormControl fullWidth variant="filled">
                  <TextField
                    fullWidth
                    label="Titulo"
                    variant="filled"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                  <FormHelperText>
                    El título no es visible por los candidatos, solamente se usa
                    para facilitar la gestión interna
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">
                    Idioma del cuestionario
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={language}
                    onChange={(event) => {
                      setLanguaje(event.target.value);
                    }}
                    label="Idioma del cuestionario"
                  >
                    <MenuItem value={1}>Español</MenuItem>
                    <MenuItem value={4}>Portugués</MenuItem>
                  </Select>
                  <FormHelperText>
                    Aunque la oferta de trabajo esté para una tienda en
                    concreto, el cuestionario puede estar en otros idiomas para
                    visualizarse.
                  </FormHelperText>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">
                  Crear
                </Button>
              </Stack>
            </Box>
          </Paper>
        </form>
      </Container>
    </Modal>
  );
};
