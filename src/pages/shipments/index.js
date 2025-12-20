import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Columns03, FilterFunnel01 } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { MultiSelect } from '../../components/multi-select';
import { paths } from '../../paths';
import { ShipmentListTable } from '../../sections/shipment/shipment-list-table';
import { shipmentsApi } from '../../api/shipments';
import { usePageView } from '../../hooks/use-page-view';

const columnOptions = [
  {
    label: 'Número',
    value: 'number',
  },
  {
    label: 'Pedido',
    value: 'orderId',
  },
  {
    label: 'Estado',
    value: 'status',
  },
  {
    label: 'Agencia',
    value: 'shippingProvider',
  },
  {
    label: 'Cliente',
    value: 'customer',
  },
  {
    label: 'Tienda',
    value: 'store',
  },
  {
    label: 'Productos',
    value: 'products',
  },
  {
    label: 'Cantidad',
    value: 'quantity',
  },
  {
    label: 'Última actualización',
    value: 'updatedAt',
  },
  {
    label: 'Fecha de creación',
    value: 'createdAt',
  },
  {
    label: 'Acciones',
    value: 'actions',
  },
];

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      orderId: undefined,
      customerId: undefined,
      status: undefined,
      reason: undefined,
      packageStatus: undefined,
    },
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useShipments = (search) => {
  const [state, setState] = useState({
    shipments: [],
    shipmentsCount: 0,
    loading: true,
  });

  const getShipments = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await shipmentsApi.getShipments(request);
      setState({
        shipments: response.data,
        shipmentsCount: response.total,
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
    getShipments(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const ShipmentsList = () => {
  const { search, updateSearch } = useSearch();
  const { shipments, shipmentsCount, loading } = useShipments(search);
  const [columns, setColumns] = useState(
    columnOptions.map((column) => column.value),
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  return (
    <>
      <Head>
        <title>Envíos | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de envíos</Typography>
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
                    href={paths.shipments.index}
                    variant="subtitle2"
                  >
                    Envíos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="black"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <FilterFunnel01 />
                    </SvgIcon>
                  }
                  variant="text"
                  onClick={() => setIsFiltersOpen((prevState) => !prevState)}
                >
                  Filtros
                </Button>
                <MultiSelect
                  label="Columnas"
                  options={columnOptions}
                  value={columns}
                  onChange={setColumns}
                  color="black"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Columns03 />
                    </SvgIcon>
                  }
                  variant="text"
                />
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <ShipmentListTable
                columns={columns}
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                shipments={shipments}
                shipmentsCount={shipmentsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ShipmentsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ShipmentsList;
