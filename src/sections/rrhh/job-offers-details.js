import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material';
import { jobsOfferAPI } from '../../api/jobs-offers';
import { languagesApi } from '../../api/languages';
import { countriesAPI } from '../../api/countries';
import { pickUpStoresAPI } from '../../api/pickup';
import { QuillEditor } from '../../components/quill-editor';
import { ModalVisualizerJobOffer } from './job-offer-visualizer-modal';

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

export const JobOffersDetails = ({ jobOffer, refetch }) => {
  const { countries } = useCountry();
  const { stores } = useStore();
  const { languages } = useLang();
  const [position_name, setPosition_name] = useState(jobOffer.position_name);
  const [description, setDescription] = useState(jobOffer.position_description);
  const [requirements, setRequirements] = useState(jobOffer.position_requisits);
  const [benefits, setBenefits] = useState(jobOffer.positions_benefits);
  const [positionType, setPositionType] = useState(jobOffer.position_type_job);
  const [hours, setHours] = useState(jobOffer.position_journal_time_per_week);
  const [store, setStore] = useState(jobOffer.physical_store_id ?? '');
  const [store_name, setStoreName] = useState(jobOffer.store_name);
  const [city, setCity] = useState(
    jobOffer.physical_store?.locality ?? jobOffer.store_city,
  );
  const [position_journal_type_job, setPositionJournalTypeJob] = useState(
    jobOffer.position_journal_type_job,
  );
  const [language, setLanguage] = useState(jobOffer.language_id);
  const [country, setCountry] = useState(jobOffer.country_id);
  const [visibility, setVisibility] = useState(jobOffer.visibility);
  const [salaryExpectations, setSalaryExpectations] = useState(
    jobOffer.salary_expectations,
  );
  const [salaryVisibility, setSalaryVisibility] = useState(
    jobOffer.salary_visibility,
  );
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const [openVisualizerModal, setOpenVisualizerModal] = useState(false);

  const handleUpdateDetails = async () => {
    try {
      setIsUpdatingDetails(true);
      await jobsOfferAPI.updateJobOffer(jobOffer.id, {
        position_name,
        position_description: description,
        position_requisits: requirements,
        positions_benefits: benefits,
        position_type_job: positionType,
        position_journal_time_per_week: hours,
        physical_store_id: store ?? null,
        store_name: store_name ?? null,
        store_city: city ?? null,
        salary_expectations: salaryExpectations ?? null,
        salary_visibility: salaryVisibility ? 1 : 0,
        position_journal_type_job,
        language_id: language,
        country_id: country,
        visibility: visibility ? 1 : 0,
      });
      toast.success('Detalles actualizados');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No fue posible actualizar los detalles');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Grid container justifyContent="flex-end">
          {error.state && (
            <Grid>
              <Box sx={{ color: 'error.main' }}>{error.message}</Box>
            </Grid>
          )}
          <Box>
            <Button
              variant="outlined"
              onClick={(prev) => setOpenVisualizerModal(!openVisualizerModal)}
            >
              Visualizar
            </Button>
          </Box>
        </Grid>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardHeader
                  title="Detalles del puesto"
                  subheader="Agrega y edita detalles de la posición ofertada."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Nombre del puesto"
                      name="position_name"
                      onChange={(e) => setPosition_name(e.target.value)}
                      required
                      value={position_name}
                      variant="outlined"
                    />
                    <Box>
                      <Typography variant="subtitle2">
                        Descripción del puesto
                      </Typography>
                      <QuillEditor
                        onChange={setDescription}
                        placeholder="Escriba la descripción del puesto"
                        sx={{ height: 500 }}
                        value={description}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Requisitos del puesto
                      </Typography>
                      <QuillEditor
                        onChange={setRequirements}
                        placeholder="Escriba los requisitos del puesto"
                        sx={{ height: 500 }}
                        value={requirements}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Beneficios del puesto
                      </Typography>
                      <QuillEditor
                        onChange={setBenefits}
                        placeholder="Escriba los beneficios del puesto"
                        sx={{ height: 500 }}
                        value={benefits}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader
                  title="Horarios y Ubicación"
                  subheader="Agrega y edita los horarios, ubicación y el tipo de contrato de la posición ofertada."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo de puesto</InputLabel>
                      <Select
                        value={positionType}
                        label="Tipo de puesto"
                        onChange={(event) =>
                          setPositionType(event.target.value)
                        }
                      >
                        <MenuItem key={0} value={''}>
                          Selecciona un tipo de puesto
                        </MenuItem>
                        <MenuItem key={1} value="temporal">
                          Temporal
                        </MenuItem>
                        <MenuItem key={2} value="undefined">
                          Indefinido
                        </MenuItem>
                        <MenuItem key={3} value="discontinued-fixed">
                          Fijo discontinuo
                        </MenuItem>
                        <MenuItem key={4} value="work-leave">
                          Baja laboral
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo de jornada</InputLabel>
                      <Select
                        value={position_journal_type_job}
                        label="Tipo de jornada"
                        onChange={(event) =>
                          setPositionJournalTypeJob(event.target.value)
                        }
                      >
                        <MenuItem key={0} value={''}>
                          Selecciona un tipo de puesto
                        </MenuItem>
                        <MenuItem key={1} value="partial">
                          Parcial
                        </MenuItem>
                        <MenuItem key={2} value="complete">
                          Completa
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Horas semanales"
                      name="hours"
                      onChange={(e) => setHours(e.target.value)}
                      value={hours}
                      variant="outlined"
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Tienda</InputLabel>
                      {stores && (
                        <Select
                          value={store}
                          label="Tienda"
                          onChange={(event) => setStore(event.target.value)}
                        >
                          <MenuItem key={0} value={''}>
                            Selecciona una tienda
                          </MenuItem>
                          {stores.map((store) => (
                            <MenuItem key={store.id} value={store.id}>
                              {store.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      <FormHelperText>
                        Si se ha dado un nombre de tienda, no se puede
                        seleccionar una.
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      {store != 0 ? (
                        <TextField
                          fullWidth
                          label="Nombre de tienda"
                          disabled
                          name="store_name"
                          onChange={(e) => setStoreName(e.target.value)}
                          value={store_name}
                          variant="outlined"
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label="Nombre de tienda"
                          name="store_name"
                          onChange={(e) => setStoreName(e.target.value)}
                          value={store_name}
                          variant="outlined"
                        />
                      )}
                      <FormHelperText>
                        Si se ha seleccionado una tienda, este campo no se puede
                        editar.
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      {store != 0 ? (
                        <TextField
                          fullWidth
                          disabled
                          label="Ciudad"
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                          value={city}
                          variant="outlined"
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label="Ciudad"
                          name="city"
                          onChange={(e) => setCity(e.target.value)}
                          value={city}
                          variant="outlined"
                        />
                      )}
                      <FormHelperText>
                        La ciudad se obtiene de la tienda seleccionada, si se ha
                        seleccionado una tienda este campo no se puede editar.
                        Se actualizará automáticamente si se cambia la tienda y
                        guarda los detalles.
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth required>
                      <InputLabel>País</InputLabel>
                      {countries && (
                        <Select
                          value={country}
                          label="País"
                          onChange={(event) => setCountry(event.target.value)}
                        >
                          <MenuItem key={0} value={''}>
                            Selecciona un país
                          </MenuItem>
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.nicename}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <FormControl fullWidth required>
                      <InputLabel>Idioma</InputLabel>
                      {languages && (
                        <Select
                          value={language}
                          label="Idioma"
                          onChange={(event) => setLanguage(event.target.value)}
                        >
                          <MenuItem key={0} value={''}>
                            Selecciona un idioma
                          </MenuItem>
                          {languages.map((language) => (
                            <MenuItem key={language.id} value={language.id}>
                              {language.language}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Salario anual"
                      name="salaryexpectations"
                      type="number"
                      onChange={(e) => setSalaryExpectations(e.target.value)}
                      value={salaryExpectations}
                      variant="outlined"
                    />
                    <FormControl>
                      <FormLabel sx={{ ml: 1 }} component="legend">
                        Visibilidad de salario
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{ ml: 1 }}
                            checked={salaryVisibility > 0}
                            onChange={(event) => {
                              setSalaryVisibility(event.target.checked ? 1 : 0);
                            }}
                            name="visibilitySalary"
                          />
                        }
                        label={
                          salaryVisibility > 0
                            ? 'Salario visible'
                            : 'Salario oculto'
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel sx={{ ml: 1 }} component="legend">
                        Visibilidad de la oferta
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{ ml: 1 }}
                            checked={visibility > 0}
                            onChange={(event) => {
                              setVisibility(event.target.checked ? 1 : 0);
                            }}
                            name="visibility"
                          />
                        }
                        label={visibility > 0 && 'Oferta visible'}
                      />
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container justifyContent="center">
              <Grid>
                <Button
                  sx={{ minWidth: 300 }}
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateDetails}
                  disabled={isUpdatingDetails}
                >
                  {isUpdatingDetails
                    ? 'Actualizando...'
                    : 'Actualizar detalles'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>
        <ModalVisualizerJobOffer
          open={openVisualizerModal}
          onClose={setOpenVisualizerModal}
          jobOfferData={{
            position_name,
            position_description: description,
            position_requisits: requirements,
            positions_benefits: benefits,
            position_type_job: positionType,
            position_journal_time_per_week: hours,
            physical_store_id: store,
            physical_store: jobOffer.physical_store,
            store_name: store_name,
            store_city: city,
            salary_expectations: salaryExpectations,
            salary_visibility: salaryVisibility ? 1 : 0,
            position_journal_type_job,
            language_id: language,
            country_id: country,
            visibility: visibility ? 1 : 0,
          }}
        />
      </Stack>
    </>
  );
};
