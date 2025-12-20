import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { PromotionUpdateForm } from '../../sections/promotion/promotion-update-form';
import { promotionsApi } from '../../api/promotions';

const usePromotion = (promotionId) => {
  const [state, setState] = useState({
    promotion: null,
    loading: true,
  });

  const getPromotion = useCallback(async (id) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await promotionsApi.getPromotionById(id);
      setState({
        promotion: response,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      setState({
        promotion: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    if (promotionId) {
      getPromotion(promotionId);
    }
  }, [promotionId, getPromotion]);

  return [state, () => getPromotion(promotionId)];
};

const Page = () => {
  const router = useRouter();
  const { promotionId } = router.query;
  const [{ promotion, loading }, refetch] = usePromotion(promotionId);

  usePageView();

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Promoción | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Información de la promoción</Typography>
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
                  href={paths.promotions.index}
                  variant="subtitle2"
                >
                  Promociones
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Promoción
                </Typography>
              </Breadcrumbs>
            </Stack>
            <PromotionUpdateForm promotion={promotion} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
