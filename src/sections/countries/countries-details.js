import { useCallback, useState } from 'react';
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
} from '@mui/material';
import { countriesAPI } from '../../api/countries';

export const CountriesDetails = ({ country, refetch }) => {
  const [countryState, setCountryState] = useState(country);
  const [updating, setUpdating] = useState(false);

  const handleUpdateCountry = useCallback(async () => {
    try {
      setUpdating(true);
      const res = await countriesAPI.updateCountry(countryState.id, {
        name: countryState.name,
        iso: countryState.iso,
        iso3: countryState.iso3,
        nicename: countryState.nicename,
        postal_code_format: countryState.postal_code_format,
        postal_code_regex: countryState.postal_code_regex,
      });
      if (res) {
        toast.success('País actualizado correctamente');
        refetch();
      }
    } catch (error) {
      toast.error('Error al actualizar el país');
    } finally {
      setUpdating(false);
    }
  }, [countryState, refetch]);

  const handleChange = (field, value) => {
    setCountryState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader
                title="Información del país"
                subheader="Podrás cambiar la información del país. Recuerda guardar los cambios."
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheaderTypographyProps={{ variant: 'caption' }}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre oficial"
                      value={countryState.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={countryState.nicename || ''}
                      onChange={(e) => handleChange('nicename', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ISO"
                      value={countryState.iso || ''}
                      onChange={(e) => handleChange('iso', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ISO3"
                      value={countryState.iso3 || ''}
                      onChange={(e) => handleChange('iso3', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Formato código postal"
                      value={countryState.postal_code_format || ''}
                      onChange={(e) =>
                        handleChange('postal_code_format', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Regex código postal"
                      value={countryState.postal_code_regex || ''}
                      onChange={(e) =>
                        handleChange('postal_code_regex', e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Stack direction="row" spacing={1} p={3}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleUpdateCountry}
                  disabled={updating}
                >
                  {updating ? 'Actualizando...' : 'Actualizar país'}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
