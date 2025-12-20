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
import { ProductCreateForm } from '../../sections/product/product-create-form';

const ProductCreate = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>Crear producto | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">Crear nuevo producto</Typography>
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
                  href={paths.products.index}
                  variant="subtitle2"
                >
                  Productos
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Crear
                </Typography>
              </Breadcrumbs>
            </Stack>
            <ProductCreateForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductCreate;
