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
import { DiscountUpdateForm } from '../../sections/discount/discount-update-form';
import { discountsApi } from '../../api/discounts';

const useDiscount = (discountId) => {
  const [state, setState] = useState({
    discount: null,
    loading: true,
  });

  const getDiscount = useCallback(async (id) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await discountsApi.getDiscountById(id);
      setState({
        discount: response,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      setState({
        discount: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    if (discountId) {
      getDiscount(discountId);
    }
  }, [discountId, getDiscount]);

  return [state, () => getDiscount(discountId)];
};

const Page = () => {
  const router = useRouter();
  const { discountId } = router.query;
  const [{ discount, loading }, refetch] = useDiscount(discountId);

  usePageView();

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Descuento | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Información del descuento</Typography>
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
                  href={paths.discounts.index}
                  variant="subtitle2"
                >
                  Descuentos
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Descuento
                </Typography>
              </Breadcrumbs>
            </Stack>
            <DiscountUpdateForm discount={discount} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
