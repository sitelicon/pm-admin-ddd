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
import { DiscountCreateForm } from '../../sections/discount/discount-create-form';

const DiscountCreate = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>Crear descuento catálogo | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Crear nuevo descuento</Typography>
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
                  Crear
                </Typography>
              </Breadcrumbs>
            </Stack>
            <DiscountCreateForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

DiscountCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DiscountCreate;
