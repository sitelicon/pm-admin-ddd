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
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { pickupStoresApi } from '../../api/pickup-stores';
import { PickupStoreEditForm } from '../../sections/pickup-store/pickup-store-edit-form';

const useStore = (storeId) => {
  const [state, setState] = useState({
    store: undefined,
    loading: true,
  });

  const getStore = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await pickupStoresApi.getStoreById(storeId);
      setState((prevState) => ({
        ...prevState,
        store: response,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [storeId]);

  useEffect(() => {
    getStore();
  }, [getStore]);

  return {
    ...state,
    refetch: () => getStore(),
  };
};

const Page = () => {
  const router = useRouter();
  const { storeId } = router.query;
  const { store, loading, refetch } = useStore(storeId);
  const [name, setName] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name);
    }
  }, [store]);

  return (
    <>
      <Head>
        <title>Detalles de la tienda física | PACOMARTINEZ</title>
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
                  href={paths.pickupStores.index}
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
                    Volver al listado de tiendas físicas
                  </Typography>
                </Link>
              </div>
              <Stack spacing={1}>
                <Typography variant="h5">Tienda física: {name}</Typography>
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
                    href={paths.pickupStores.index}
                    variant="subtitle2"
                  >
                    Tiendas físicas
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Editar tienda física
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <PickupStoreEditForm store={store} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
