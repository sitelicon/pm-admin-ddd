import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
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

export const CountryCreateModal = ({ open, onClose, createCountry }) => {
  const router = useRouter();
  const [error, setError] = useState(undefined);
  const [country, setCountry] = useState({
    iso: '',
    iso3: '',
    name: '',
    nicename: '',
    postal_code_format: '',
    postal_code_regex: '',
  });

  const handleClose = () => {
    setCountry({
      iso: '',
      iso3: '',
      name: '',
      nicename: '',
      postal_code_format: '',
      postal_code_regex: '',
    });
    onClose();
  };

  const handleCreateCountry = async (event) => {
    event.preventDefault();
    try {
      const response = await createCountry({
        iso: country.iso,
        iso3: country.iso3,
        name: country.name,
        nicename: country.nicename,
        postal_code_format: country.postal_code_format,
        postal_code_regex: country.postal_code_regex,
      });
      toast.success('País creado correctamente');
      setError(undefined);
      handleClose();
      router.push(`/countries/${response.id}`);
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
          <form onSubmit={handleCreateCountry}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5">Crear país</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Rellena los campos para crear un nuevo país, recuerda que
                  todos los campos son obligatorios.
                </Typography>
                <TextField
                  error={!!error}
                  fullWidth
                  label="Código ISO (2 letras)"
                  margin="normal"
                  variant="filled"
                  value={country.iso}
                  onChange={(event) =>
                    setCountry({ ...country, iso: event.target.value })
                  }
                  helperText={error || 'El código ISO de 2 letras del país'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Código ISO3 (3 letras)"
                  margin="normal"
                  variant="filled"
                  value={country.iso3}
                  onChange={(event) =>
                    setCountry({ ...country, iso3: event.target.value })
                  }
                  helperText={error || 'El código ISO3 de 3 letras del país'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Nombre oficial del país"
                  margin="normal"
                  variant="filled"
                  value={country.name}
                  onChange={(event) =>
                    setCountry({ ...country, name: event.target.value })
                  }
                  helperText={error || 'El nombre oficial del país'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Nombre corto del país"
                  margin="normal"
                  variant="filled"
                  value={country.nicename}
                  onChange={(event) =>
                    setCountry({ ...country, nicename: event.target.value })
                  }
                  helperText={error || 'El nombre corto del país'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Formato código postal"
                  margin="normal"
                  variant="filled"
                  value={country.postal_code_format}
                  onChange={(event) =>
                    setCountry({
                      ...country,
                      postal_code_format: event.target.value,
                    })
                  }
                  helperText={error || 'El formato del código postal del país'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Regex código postal"
                  margin="normal"
                  variant="filled"
                  value={country.postal_code_regex}
                  onChange={(event) =>
                    setCountry({
                      ...country,
                      postal_code_regex: event.target.value,
                    })
                  }
                  helperText={
                    error || 'La expresión regular del código postal del país'
                  }
                  required
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
                  Crear país
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

CountryCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
