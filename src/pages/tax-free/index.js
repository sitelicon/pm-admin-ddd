import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Breadcrumbs,
  Card,
  Container,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { usePageView } from '../../hooks/use-page-view';
import { ordersApi } from '../../api/orders';
import { TaxFreeListTable } from '../../sections/tax-free/tax-free-list-table';
import { pickupStoresApi } from '../../api/pickup-stores';

const useStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await pickupStoresApi.getStores();
        const orderedStores = response.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setStores(orderedStores);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return {
    stores,
    loadingStores: loading,
  };
};

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      orderId: undefined,
      status: undefined,
      shopId: undefined,
    },
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useTaxFreeRequests = (search) => {
  const [state, setState] = useState({
    requests: [],
    requestsCount: 0,
    loading: true,
  });

  const getRequests = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await ordersApi.getTaxFreeRequests(request);
      setState({
        requests: response.data,
        requestsCount: response.total,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getRequests(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    refetch: () => getRequests(search),
    ...state,
  };
};

const TaxFreeRequestsList = () => {
  const { search, updateSearch } = useSearch();
  const { requests, requestsCount, loading, refetch } =
    useTaxFreeRequests(search);
  const { stores } = useStores();

  usePageView();

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch],
  );

  const handlePerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        perPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch],
  );

  const handleQueryChange = useCallback(
    (event) => {
      event.preventDefault();

      updateSearch((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          orderId: event.target.orderId.value,
        },
      }));
    },
    [updateSearch],
  );

  return (
    <>
      <Head>
        <title>Solicitudes TAX FREE | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">
                  Pedidos libres de impuestos
                </Typography>
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
                    href={paths.orders.index}
                    variant="subtitle2"
                  >
                    Pedidos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Tax free
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="flex-start" spacing={2}>
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{ flexGrow: 1 }}
              >
                <OutlinedInput
                  defaultValue=""
                  fullWidth
                  name="orderId"
                  placeholder="Buscar por número de pedido"
                  startAdornment={
                    <InputAdornment position="start">
                      <SvgIcon>
                        <SearchMdIcon />
                      </SvgIcon>
                    </InputAdornment>
                  }
                />
              </Box>
              <FormControl>
                <InputLabel>Tienda</InputLabel>
                <Select
                  label="Tienda"
                  onChange={(event) => {
                    updateSearch((prevState) => ({
                      ...prevState,
                      filters: {
                        ...prevState.filters,
                        shopId: event.target.value,
                      },
                    }));
                  }}
                  sx={{ minWidth: 250 }}
                  value={search.filters.shopId}
                >
                  <MenuItem value={undefined} selected>
                    Todas las tiendas
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.erp_id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Tienda"
                  onChange={(event) => {
                    updateSearch((prevState) => ({
                      ...prevState,
                      filters: {
                        ...prevState.filters,
                        status: event.target.value,
                      },
                    }));
                  }}
                  sx={{ minWidth: 250 }}
                  value={search.filters.shopId}
                >
                  <MenuItem value={undefined} selected>
                    Todos los estados
                  </MenuItem>
                  <MenuItem value={'approved'}>Aprobado</MenuItem>
                  <MenuItem value={'pending'} selected>
                    Pendiente
                  </MenuItem>
                  <MenuItem value={'declined'} selected>
                    Rechazado
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Divider />

            <Card>
              <TaxFreeListTable
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                requests={requests}
                requestsCount={requestsCount}
                perPage={search.perPage}
                refetch={refetch}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

TaxFreeRequestsList.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default TaxFreeRequestsList;
