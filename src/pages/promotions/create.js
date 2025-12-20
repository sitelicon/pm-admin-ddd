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
import { PromotionCreateForm } from '../../sections/promotion/promotion-create-form';

const PromotionCreate = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>Crear promoción carrito | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Crear nueva promoción</Typography>
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
                  Crear
                </Typography>
              </Breadcrumbs>
            </Stack>
            <PromotionCreateForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PromotionCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PromotionCreate;
