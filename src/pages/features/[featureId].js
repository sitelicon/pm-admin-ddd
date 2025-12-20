import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ArrowLeft } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { featuresApi } from '../../api/features';
import { useLanguageId } from '../../hooks/use-language-id';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { FeatureEditForm } from '../../sections/feature/feature-edit-form';

const useFeature = (featureId) => {
  const [state, setState] = useState({
    feature: undefined,
    loading: true,
  });

  const getFeature = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await featuresApi.getFeature(featureId);
      setState((prevState) => ({
        ...prevState,
        feature: response,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [featureId]);

  useEffect(() => {
    getFeature();
  }, [getFeature]);

  return {
    ...state,
    refetch: () => getFeature(),
  };
};

const Page = () => {
  const router = useRouter();
  const { featureId } = router.query;
  const { feature, loading, refetch } = useFeature(featureId);
  const [name, setName] = useState('');

  useEffect(() => {
    if (feature) {
      setName(feature.name);
    }
  }, [feature]);

  return (
    <>
      <Head>
        <title>Detalles de la característica | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={2}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.features.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeft />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    Volver al listado de características
                  </Typography>
                </Link>
              </div>
              <Stack spacing={1}>
                <Typography variant="h5">Característica: {name}</Typography>
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
                    href={paths.features.index}
                    variant="subtitle2"
                  >
                    Características
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Editar característica
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <FeatureEditForm feature={feature} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
