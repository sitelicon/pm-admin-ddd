import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronRight } from '@mui/icons-material';
import numeral from 'numeral';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ChevronDown, Download02 } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { useStores } from '../../hooks/use-stores';
import { reportsApi } from '../../api/reports';
import { Scrollbar } from '../../components/scrollbar';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { useLocalStorage } from '../../hooks/use-local-storage';

const intervalOptions = [
  {
    label: 'Diario',
    value: 'daily',
  },
  {
    label: 'Mensual',
    value: 'monthly',
  },
  {
    label: 'Anual',
    value: 'yearly',
  },
];

const dateUsedOptions = [
  {
    label: 'Fecha de creación',
    value: 'created_at',
  },
  {
    label: 'Fecha de actualización',
    value: 'updated_at',
  },
];

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const stores = useStores();
  const [report, setReport] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useLocalStorage('salesReportFilters', {
    dateField: 'created_at',
    from: undefined,
    to: undefined,
    interval: 'daily',
    storeId: undefined,
    reference: '',
  });

  const handleStoreIdChange = (event) => {
    const { value } = event.target;

    setFilters((filters) => ({
      ...filters,
      storeId: value.length > 0 ? value : undefined,
    }));
  };

  const generateReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getProductSalesReport(filters);
      setFiltersOpen(false);
      setReport(response.data);
      setTotal(response.total);
      toast.success('Reporte generado correctamente');
    } catch (error) {
      toast.error('Ocurrió un error al generar el reporte');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const formatDate = useCallback(
    (date) => {
      switch (filters.interval) {
        case 'daily':
          return format(date, 'dd/MM/yyyy', { locale: es });
        case 'monthly':
          return format(date, 'MMMM yyyy', { locale: es });
        case 'yearly':
          return format(date, 'yyyy', { locale: es });
        default:
          return '';
      }
    },
    [filters.interval],
  );

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <>
      <Head>
        <title>Reporte de ventas | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">
                  Reporte de ventas por producto
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
                  <Typography color="text.secondary" variant="subtitle2">
                    Reportes
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    Ventas
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}></Stack>
            </Stack>
            <Divider />
            <Card>
              <CardHeader
                title="Generar reporte"
                subheader="Ajuste los filtros antes de generar el reporte"
                action={
                  <Tooltip
                    title={filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
                  >
                    <IconButton
                      aria-label="Filtros"
                      onClick={() => setFiltersOpen((open) => !open)}
                    >
                      <SvgIcon fontSize="small">
                        {filtersOpen ? <ChevronDown /> : <ChevronRight />}
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                }
              />
              <Collapse in={filtersOpen}>
                <PropertyList>
                  <PropertyListItem align={align} divider label="Referencia">
                    <TextField
                      hiddenLabel
                      SelectProps={{ native: true }}
                      value={filters.reference}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          reference: event.target.value,
                        }));
                      }}
                    ></TextField>
                  </PropertyListItem>
                  <PropertyListItem align={align} divider label="Fecha usada">
                    <TextField
                      hiddenLabel
                      select
                      SelectProps={{ native: true }}
                      value={filters.dateField}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          dateField: event.target.value,
                        }));
                      }}
                    >
                      {dateUsedOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </PropertyListItem>
                  <PropertyListItem align={align} divider label="Intervalo">
                    <TextField
                      hiddenLabel
                      select
                      SelectProps={{ native: true }}
                      value={filters.interval}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          interval: event.target.value,
                        }));
                      }}
                    >
                      {intervalOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </PropertyListItem>
                  <PropertyListItem
                    align={align}
                    divider
                    label="Fecha de inicio*"
                  >
                    <DatePicker
                      clearable
                      format="dd/MM/yyyy"
                      value={filters.from ? new Date(filters.from) : null}
                      onChange={(date) =>
                        setFilters((filters) => ({
                          ...filters,
                          from: moment(date).format('YYYY-MM-DD'),
                        }))
                      }
                      label="Fecha de inicio"
                      renderInput={(params) => <TextField {...params} />}
                      slotProps={{
                        textField: { InputLabelProps: { required: true } },
                      }}
                    />
                  </PropertyListItem>
                  <PropertyListItem align={align} divider label="Fecha de fin*">
                    <DatePicker
                      clearable
                      format="dd/MM/yyyy"
                      value={filters.to ? new Date(filters.to) : null}
                      onChange={(date) =>
                        setFilters((filters) => ({
                          ...filters,
                          to: moment(date).format('YYYY-MM-DD'),
                        }))
                      }
                      label="Fecha de fin"
                      renderInput={(params) => <TextField {...params} />}
                      slotProps={{
                        textField: { InputLabelProps: { required: true } },
                      }}
                    />
                  </PropertyListItem>
                  <PropertyListItem align={align} divider label="Tienda">
                    <TextField
                      hiddenLabel
                      select
                      SelectProps={{ native: true }}
                      value={filters.storeId || ''}
                      onChange={handleStoreIdChange}
                    >
                      <option value="">Todas</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name}
                        </option>
                      ))}
                    </TextField>
                  </PropertyListItem>
                </PropertyList>
              </Collapse>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                padding={3}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={generateReport}
                  disabled={loading || !filters.from || !filters.to}
                >
                  {loading ? 'Generando reporte…' : 'Generar reporte'}
                </Button>
              </Stack>
            </Card>
            {report && (
              <Card>
                <CardHeader
                  title="Reporte"
                  subheader="Reporte de ventas generado"
                  action={
                    <CSVLink
                      data={report.reduce((acc, row) => {
                        const { orders } = row;
                        return [
                          ...acc,
                          ...orders.map((order) => ({
                            interval: formatDate(new Date(row.interval)),
                            order_number: order.order.order_number,
                            quantity: order.qty_ordered,
                            color: order.product.color.name_admin,
                            sales_total: numeral(
                              order.row_total_incl_tax,
                            ).format('$0,0.00'),
                          })),
                        ];
                      }, [])}
                      headers={[
                        { label: 'Fecha', key: 'interval' },
                        { label: 'Color', key: 'color' },
                        { label: 'Nº Pedido', key: 'order_number' },
                        { label: 'Unidades vendidas', key: 'quantity' },
                        { label: 'Total con tax', key: 'sales_total' },
                      ]}
                      filename={`reporte-ventas-${formatDate(
                        new Date(filters.from),
                      )}-${formatDate(new Date(filters.to))}.csv`}
                    >
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        startIcon={
                          <SvgIcon>
                            <Download02 />
                          </SvgIcon>
                        }
                      >
                        Exportar CSV
                      </Button>
                    </CSVLink>
                  }
                />
                <CardContent>
                  <Scrollbar>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Color</TableCell>
                          <TableCell align="center">Nº Pedido</TableCell>
                          <TableCell align="center">
                            Unidades vendidas
                          </TableCell>
                          <TableCell>Importe con Tax</TableCell>
                          <TableCell>Tienda</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.map((row) => {
                          const [first, ...rest] = row.orders;
                          return (
                            <>
                              <TableRow key={first.order.id} hover>
                                <TableCell
                                  rowSpan={row.orders.length}
                                  sx={{ verticalAlign: 'top' }}
                                >
                                  {formatDate(new Date(row.interval))}
                                </TableCell>
                                <TableCell
                                  rowSpan={row.orders.length}
                                  sx={{ verticalAlign: 'top' }}
                                >
                                  {row.color}
                                </TableCell>
                                <TableCell align="center">
                                  <Link
                                    key={first.order.id}
                                    color="primary"
                                    component={NextLink}
                                    href={'/orders/' + first.order.id}
                                  >
                                    {first.order.order_number}
                                  </Link>
                                </TableCell>
                                <TableCell align="center">
                                  {first.qty_ordered}
                                </TableCell>
                                <TableCell>
                                  {numeral(first.row_total_incl_tax).format(
                                    '$0,0.00',
                                  )}
                                </TableCell>
                                <TableCell>
                                  {
                                    stores.find(
                                      (store) =>
                                        store.id === first.order.store_id,
                                    ).name
                                  }
                                </TableCell>
                              </TableRow>
                              {rest.map((order) => (
                                <TableRow key={order.order.id} hover>
                                  <TableCell align="center">
                                    <Link
                                      key={order.order.id}
                                      color="primary"
                                      component={NextLink}
                                      href={'/orders/' + order.order.id}
                                    >
                                      {order.order.order_number}
                                    </Link>
                                  </TableCell>
                                  <TableCell align="center">
                                    {order.qty_ordered}
                                  </TableCell>
                                  <TableCell>
                                    {numeral(order.row_total_incl_tax).format(
                                      '$0,0.00',
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {
                                      stores.find(
                                        (store) =>
                                          store.id === order.order.store_id,
                                      ).name
                                    }
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          );
                        })}
                        <TableRow
                          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                        >
                          <TableCell>
                            <strong>TOTAL HISTÓRICO</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>{total.orders}</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>{total.sales_items}</strong>
                          </TableCell>
                          <TableCell>
                            <strong>
                              {numeral(total.sales_total).format('$0,0.00')}
                            </strong>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
