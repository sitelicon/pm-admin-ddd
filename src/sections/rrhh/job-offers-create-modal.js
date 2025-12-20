import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {
  Modal,
  Paper,
  TextField,
  Typography,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { jobsOfferAPI } from '../../api/jobs-offers';
import { languagesApi } from '../../api/languages';
import { countriesAPI } from '../../api/countries';
import { pickUpStoresAPI } from '../../api/pickup';

const useLang = () => {
  const [state, setState] = useState({
    languages: [],
    loadingLanguages: true,
  });

  const getLanguages = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: true,
      }));

      const res = await languagesApi.getLanguages();

      setState({
        languages: res,
        loadingLanguages: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: false,
      }));
    }
  };

  useEffect(() => {
    getLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

const useCountry = () => {
  const [state, setState] = useState({
    countries: [],
    loadingCountries: true,
  });

  const getCountries = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingCountries: true,
      }));

      const res = await countriesAPI.getCountries();

      setState({
        countries: res,
        loadingCountries: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingCountries: false,
      }));
    }
  };

  useEffect(() => {
    getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

const useStore = () => {
  const [state, setState] = useState({
    stores: [],
    loadingStores: true,
  });

  const getStores = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingStores: true,
      }));

      const res = await pickUpStoresAPI.getPickUpStores();

      setState({
        stores: res,
        loadingStores: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingStores: false,
      }));
    }
  };

  useEffect(() => {
    getStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

export const JobOffersCreateModal = ({ open, onClose }) => {
  const router = useRouter();
  const { languages } = useLang();
  const { countries } = useCountry();
  const { stores } = useStore();
  const [position_name, setPosition_name] = useState('');
  const [languages_id, setLanguages_id] = useState('');
  const [store, setStore] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(undefined);
  const [store_name, setStoreName] = useState('');
  const [errorName, setErrorName] = useState(undefined);

  const handleClose = () => {
    setPosition_name('');
    setStore('');
    setStoreName('');
    setCountry('');
    onClose();
  };

  const handleJobOfferCreator = async (event) => {
    event.preventDefault();
    try {
      if (!store && !store_name) {
        setErrorName('Debes seleccionar una tienda o poner el nombre de una');
        return;
      }

      if (store && store_name) {
        setErrorName(
          'No puedes seleccionar una tienda y poner el nombre de otra',
        );
        return;
      }

      const response = await jobsOfferAPI.createJobOffer({
        position_name,
        language_id: languages_id,
        physical_store_id: store,
        store_name: store_name,
        country_id: country,
      });
      toast.success('Oferta de trabajo creada correctamente');
      setError(undefined);
      setPosition_name('');
      setLanguages_id('');
      setStoreName('');
      setStore('');
      setCountry('');
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
          <form onSubmit={handleJobOfferCreator}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography variant="h5">Crear oferta</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  La oferta de trabajo tiene estos cuatro campos obligatorios.
                  Podrás agregar más información (descripción, requisitos,
                  beneficios...) cuando la misma esté creada.
                </Typography>

                <TextField
                  error={!!error}
                  fullWidth
                  label="Introduce el nombre de la posición a ocupar"
                  margin="normal"
                  variant="filled"
                  value={position_name}
                  onChange={(event) => setPosition_name(event.target.value)}
                  required
                />
                <FormControl fullWidth error={errorName}>
                  <InputLabel>Tienda</InputLabel>
                  <Select
                    value={store}
                    label="Tienda"
                    onChange={(event) => setStore(event.target.value)}
                  >
                    {stores.map((store) => (
                      <MenuItem value={store.id} key={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Puedes seleccionar una tienda física, o dejarlo en blanco,
                    poniendo el nombre de la tienda en el siguiente campo:
                  </FormHelperText>
                </FormControl>
                <TextField
                  error={errorName}
                  fullWidth
                  label="Introduce el nombre de la tienda"
                  margin="normal"
                  variant="filled"
                  value={store_name}
                  onChange={(event) => setStoreName(event.target.value)}
                />
                <FormControl fullWidth required>
                  <InputLabel>País</InputLabel>
                  <Select
                    value={country}
                    label="País"
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    {countries.map((country) => (
                      <MenuItem value={country.id} key={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Tienda Online</InputLabel>
                  <Select
                    value={languages_id}
                    label="Idioma"
                    onChange={(event) => setLanguages_id(event.target.value)}
                  >
                    {languages.map((language) => (
                      <MenuItem value={language.id} key={language.id}>
                        {language.language}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    La selección de tienda online, obliga a una oferta de
                    trabajo, a ser sólo de ese país.
                  </FormHelperText>
                </FormControl>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                {errorName && (
                  <Typography color="error" variant="body2">
                    {errorName}
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
                  Crear oferta
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

JobOffersCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
