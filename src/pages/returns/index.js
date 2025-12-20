import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import {
  Columns03,
  Download02,
  FilterFunnel01,
} from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { MultiSelect } from '../../components/multi-select';
import { paths } from '../../paths';
import { ReturnListTable } from '../../sections/return/return-list-table';
import { returnsApi } from '../../api/returns';
import { usePageView } from '../../hooks/use-page-view';
import { ReturnListSearch } from '../../sections/return/return-list-search';

const columnOptions = [
  {
    label: 'Solicitud',
    value: 'id',
  },
  {
    label: 'Pedido',
    value: 'orderId',
  },
  {
    label: 'Cliente',
    value: 'customer',
  },
  {
    label: 'Productos',
    value: 'products',
  },
  {
    label: 'Última respuesta',
    value: 'lastResponse',
  },
  {
    label: 'Resolución',
    value: 'status',
  },
  {
    label: 'Tienda',
    value: 'store',
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
      orderNumber: undefined,
      customerId: undefined,
      status: undefined,
      reason: undefined,
      createdAt: undefined,
      storeId: undefined,
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

const useReturns = (search) => {
  const [state, setState] = useState({
    returns: [],
    returnsCount: 0,
    loading: true,
  });

  const getReturns = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await returnsApi.getReturns(request);
      setState({
        returns: response.data,
        returnsCount: response.total,
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
    getReturns(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const returnStatus = {
  pending_approval: 'Pendiente de aprobación',
  approved: 'Aprobada',
  package_received: 'Paquete recibido',
  canceled: 'Cancelada',
  closed: 'Cerrada',
  package_sent: 'Paquete enviado',
  issue_refund: 'Reembolso emitido',
};

const messageFrom = {
  auto: 'Automática',
  manager: 'Administrador',
  customer: 'Cliente',
};

const ReturnsList = () => {
  const csvLinkRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const { returns, returnsCount, loading } = useReturns(search);
  const [columns, setColumns] = useState(
    columnOptions.map((column) => column.value),
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportOrders, setExportOrders] = useState([]);
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

  const handleCSVExport = useCallback(
    async (event) => {
      try {
        setDownloading(true);
        const response = await returnsApi.getReturns(search);
        setExportOrders(response.data);
        setDownloading(false);
        csvLinkRef.current.link.click();
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo exportar las devoluciones: ${error.message}`);
        setDownloading(false);
      }
    },
    [search],
  );

  return (
    <>
      <Head>
        <title>Solicitudes RMA | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Solicitudes de devolución</Typography>
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
                    href={paths.returns.index}
                    variant="subtitle2"
                  >
                    Devoluciones
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                {returns.length > 0 && (
                  <>
                    <Button
                      size="small"
                      color="black"
                      variant="text"
                      startIcon={
                        <SvgIcon>
                          <Download02 />
                        </SvgIcon>
                      }
                      onClick={handleCSVExport}
                      disabled={downloading}
                    >
                      {downloading
                        ? 'Exportando devoluciones..'
                        : 'Exportar devoluciones'}
                    </Button>
                    <CSVLink
                      separator={';'}
                      ref={csvLinkRef}
                      data={exportOrders.map((returnItem) => {
                        const lastMessage = returnItem.messages.sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                        )[0];
                        const store =
                          returnItem.order.store_name === 'es' ||
                          returnItem.order.store_name === 'España'
                            ? 'España'
                            : returnItem.order.store_name === 'pt' ||
                              returnItem.order.store_name === 'Portugal'
                            ? 'Portugal'
                            : returnItem.order.store_name;
                        return {
                          ...returnItem,
                          id: returnItem.id,
                          order_id: returnItem.order_id,
                          customer: `${returnItem.customer.name} ${returnItem.customer.last_name} (${returnItem.customer.email})`,
                          products: returnItem.lines
                            .map(
                              (product) =>
                                product.order_line.product.name.value,
                            )
                            .join(', '),
                          lastResponse: messageFrom[lastMessage.from],
                          status: returnStatus[returnItem.status],
                          store: store,
                          updated_at: format(
                            new Date(returnItem.updated_at),
                            'MMM d, yyyy hh:mm:ss a',
                            {
                              locale: es,
                            },
                          ),
                          created_at: format(
                            new Date(returnItem.created_at),
                            'MMM d, yyyy hh:mm:ss a',
                            {
                              locale: es,
                            },
                          ),
                        };
                      })}
                      asyncOnClick={true}
                      headers={[
                        { label: 'Num. de devolución', key: 'id' },
                        { label: 'Pedido', key: 'order_id' },
                        { label: 'Cliente', key: 'customer' },
                        { label: 'Productos', key: 'products' },
                        { label: 'Última respuesta', key: 'lastResponse' },
                        { label: 'Estado', key: 'status' },
                        { label: 'Tienda', key: 'store' },
                        { label: 'Última actualización el', key: 'updated_at' },
                        {
                          label: 'Creado el',
                          key: 'created_at',
                        },
                      ]}
                      filename={`devoluciones-paco-martinez.csv`}
                    />
                  </>
                )}
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
            <ReturnListSearch
              open={isFiltersOpen}
              onFiltersChange={updateSearch}
            />
            <Card>
              <ReturnListTable
                columns={columns}
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                returns={returns}
                returnsCount={returnsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ReturnsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReturnsList;
