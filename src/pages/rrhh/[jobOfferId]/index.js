import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import {
  Box,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { paths } from '../../../paths';
import { jobsOfferAPI } from '../../../api/jobs-offers';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { JobOffersDetails } from '../../../sections/rrhh/job-offers-details';
import { JobOffersQuestions } from '../../../sections/rrhh/job-offers-questions';
import { JobOffersCandidates } from '../../../sections/rrhh/job-offers-candidates';
import { JobOffersExcludedCandidates } from '../../../sections/rrhh/job-offers-excluded-candidates';
import { ModalCloseOffer } from '../../../sections/rrhh/job-close-candidates';

const useJobOffer = (jobOfferId) => {
  const [jobOffer, setJobOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const getJobOffer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobsOfferAPI.getJobOffer(jobOfferId);
      setJobOffer(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jobOfferId]);

  useEffect(
    () => {
      getJobOffer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobOfferId],
  );

  return {
    loading,
    jobOffer,
    error,
    refetch: getJobOffer,
  };
};

const Page = () => {
  const router = useRouter();
  const { jobOfferId } = router.query;
  const { loading, jobOffer, error, refetch } = useJobOffer(jobOfferId);
  const [currentTab, setCurrentTab] = useState('detalles');
  const [deleteOffer, setDeleteOffer] = useState(false);
  const [openModalClose, setOpenModalClose] = useState(false);

  const openModalCloseOffer = () => {
    setOpenModalClose((prev) => !prev);
  };

  const deleteJobOffer = useCallback(async () => {
    try {
      setDeleteOffer(true);
      await jobsOfferAPI.deleteJobOffer(jobOfferId);
      toast.success('Oferta eliminada');
      router.push(paths.rrhh.index);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteOffer(false);
    }
  }, [jobOfferId, router]);

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
      {
        label: 'Cuestionario',
        value: 'cuestionario',
      },
      {
        label: 'Solicitantes',
        value: 'solicitantes',
      },
      {
        label: 'Descartados',
        value: 'descartados',
      },
    ];
  }, []);

  if (loading) {
    return null;
  }

  if (error || !jobOffer) {
    return <h2>No se encuentra la oferta de trabajo</h2>;
  }

  return (
    <>
      <Head>
        <title>
          Oferta de trabajo: {jobOffer.position_name || 'Cargando...'} |
          PACOMARTINEZ
        </title>
      </Head>
      <Box sx={{ flexGrow: 1, py: 4 }}>
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
                      backgroundColor: 'transparent',
                      borderRadius: 1,
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      height: 100,
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 50 }}>
                      <WorkOutlineIcon />
                    </SvgIcon>
                  </Box>
                </Box>
                <Stack spacing={1}>
                  <Typography variant="h5">{jobOffer.position_name}</Typography>
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
                      href={paths.rrhh.index}
                      variant="subtitle2"
                    >
                      Ofertas de Empleo
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Gestionar oferta de empleo
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
              <Stack spacing={1} direction={'row'} className="w-full">
                <Button variant="outlined" onClick={openModalCloseOffer}>
                  <Typography variant="subtitle2">
                    Cerrar candidatura
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  onClick={deleteJobOffer}
                  disabled={deleteOffer}
                >
                  <Typography variant="subtitle2">
                    {deleteOffer ? 'Eliminando...' : 'Eliminar'}
                  </Typography>
                </Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
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
                        <Typography variant="subtitle2">{tab.label}</Typography>
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
                  />
                ))}
              </Tabs>
              <Divider />
            </Stack>
            {currentTab === 'detalles' && (
              <JobOffersDetails jobOffer={jobOffer} refetch={refetch} />
            )}
            {currentTab === 'cuestionario' && <JobOffersQuestions />}
            {currentTab === 'solicitantes' && <JobOffersCandidates />}
            {currentTab === 'descartados' && <JobOffersExcludedCandidates />}
          </Stack>
        </Container>
        <ModalCloseOffer
          open={openModalClose}
          onClose={openModalCloseOffer}
          jobOffer={{
            id: jobOffer.id,
            name: jobOffer.position_name,
          }}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
