import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { countriesAPI } from '../../api/countries';
import { CountriesDetails } from '../../sections/countries/countries-details';
import { Globe04 } from '@untitled-ui/icons-react';

const useCountry = (countryId) => {
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(undefined);

  const getCountry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await countriesAPI.getCountry(countryId);
      setCountry(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [countryId]);

  const deleteCountry = useCallback(async () => {
    try {
      setLoading(true);
      await countriesAPI.deleteCountry(countryId);
      setCountry(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [countryId]);

  useEffect(
    () => {
      getCountry();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryId],
  );

  return {
    loading,
    country,
    error,
    refetch: getCountry,
    deleteCountry,
  };
};

const Page = () => {
  usePageView();
  const router = useRouter();
  const { countryId } = router.query;
  const { loading, country, error, refetch, deleteCountry } =
    useCountry(countryId);
  const [currentTab, setCurrentTab] = useState('detalles');
  const [isEliminating, setIsEliminating] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const eliminateCountry = useCallback(async () => {
    try {
      setIsEliminating(true);
      await deleteCountry();
      toast.success('País eliminado correctamente');
      setOpenConfirm(false);
      router.push(paths.countries.index);
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar');
    } finally {
      setIsEliminating(false);
    }
  }, [countryId, router, deleteCountry]);

  const handleTabsChange = useCallback((event, value) => {
    event.preventDefault();
    setCurrentTab(value);
  }, []);

  const tabs = useMemo(() => {
    return [
      {
        label: 'Detalles',
        value: 'detalles',
      },
    ];
  }, []);

  if (loading) {
    return null;
  }

  if (error || !country) {
    return (
      <Stack
        spacing={2}
        sx={{
          py: 10,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <SvgIcon sx={{ fontSize: 60 }}>
          <Globe04 />
        </SvgIcon>

        <Box>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            ¡Ups!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            No hemos encontrado el país solicitado.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(paths.countries.index)}
          >
            Volver a la lista de países
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <>
      <Head>
        <title>País: {country.nicename || 'Cargando…'} | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Stack spacing={1}>
                  <Typography variant="h5">{country.nicename}</Typography>
                  <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.index}
                      variant="subtitle2"
                    >
                      Inicio
                    </Link>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.countries.index}
                      variant="subtitle2"
                    >
                      Países
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Editar país
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
              <Stack spacing={1} className="w-full">
                <Button
                  variant="contained"
                  onClick={() => setOpenConfirm(true)}
                  disabled={isEliminating}
                >
                  <Typography variant="subtitle2">
                    {isEliminating ? 'Eliminando...' : 'Eliminar'}
                  </Typography>
                </Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2">
                            {tab.label}
                          </Typography>
                          {!!tab.counter && (
                            <Chip
                              label={tab.counter}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                              }}
                            />
                          )}
                        </Stack>
                      }
                      value={tab.value}
                      sx={{ py: 1, minHeight: '50px' }}
                    />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === 'detalles' && (
              <CountriesDetails country={country} refetch={refetch} />
            )}
          </Stack>
          <Dialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            maxWidth="xs"
          >
            <div style={{ padding: '24px' }}>
              <h3>Antes de eliminar...</h3>
              <p>
                Esta acción es permanente y no se puede deshacer. ¿Estás seguro
                de que quieres eliminar este país?
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => setOpenConfirm(false)}
                  disabled={isEliminating}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={eliminateCountry}
                  disabled={isEliminating}
                >
                  {isEliminating ? 'Eliminando...' : 'Sí, Eliminar'}
                </Button>
              </div>
            </div>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
