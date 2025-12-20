import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { colorsApi } from '../../api/colors';
import { ColorsDetails } from '../../sections/colors/colors-details';
import { toast } from 'react-hot-toast';

const useColor = (colorId) => {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(null);
  const [error, setError] = useState(undefined);

  const getColor = useCallback(async () => {
    try {
      setLoading(true);
      const response = await colorsApi.getColor(colorId);
      setColor(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [colorId]);

  useEffect(
    () => {
      getColor();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorId],
  );

  return {
    loading,
    color,
    error,
    refetch: getColor,
  };
};

const Page = () => {
  const router = useRouter();
  const { colorId } = router.query;
  const { loading, color, error, refetch } = useColor(colorId);
  const [currentTab, setCurrentTab] = useState('detalles');
  const [isEliminating, setIsEliminating] = useState(false);

  const eliminateColor = useCallback(async () => {
    try {
      setIsEliminating(true);
      await colorsApi.eliminateColor(colorId);
      toast.success('Color eliminado');
      router.push(paths.colors.index);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsEliminating(false);
    }
  }, [colorId, router]);

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
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

  if (error || !color) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>
          Color: {color[0].name_admin || 'Cargando…'} | PACOMARTINEZ
        </title>
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
                <Box sx={{ pr: 1 }}>
                  <Box
                    sx={{
                      background:
                        color[0].name_admin === '90-MULTICO'
                          ? 'linear-gradient(60deg, #ff6961, #77dd77, #fdfd96, #84b6f4, #fdcae1)'
                          : '',
                      backgroundColor: `${color[0].hexadecimal}`,
                      borderRadius: 1,
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      height: 100,
                      width: 100,
                    }}
                  />
                </Box>
                <Stack spacing={1}>
                  <Typography variant="h5">{color[0].name_admin}</Typography>
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
                      href={paths.colors.index}
                      variant="subtitle2"
                    >
                      Colores
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Editar color
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
              <Stack spacing={1} className="w-full">
                <Button
                  variant="contained"
                  onClick={eliminateColor}
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
              <>
                <ColorsDetails color={color} refetch={refetch} />
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
