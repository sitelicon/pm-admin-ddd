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

const formatDate = (date) => format(date, 'dd/MM/yyyy', { locale: es });

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const stores = useStores();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useLocalStorage('accountingReportFilters', {
    createdAtFrom: undefined,
    createdAtTo: undefined,
    storeId: undefined,
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
      const response = await reportsApi.getAccountingReport(filters);
      setFiltersOpen(false);
      setReport(response);
      toast.success('Reporte generado correctamente');
    } catch (error) {
      toast.error('Ocurrió un error al generar el reporte');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <>
      <Head>
        <title>Reporte de contabilidad | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Reporte de contabilidad</Typography>
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
                    Contabilidad
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
                          createdAtFrom: moment(date).format('YYYY-MM-DD'),
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
                          createdAtTo: moment(date).format('YYYY-MM-DD'),
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
                  disabled={
                    loading || !filters.createdAtFrom || !filters.createdAtTo
                  }
                >
                  {loading ? 'Generando reporte…' : 'Generar reporte'}
                </Button>
              </Stack>
            </Card>
            {report && (
              <Card>
                <CardHeader
                  title="Reporte"
                  subheader="Reporte de contabilidad generado"
                  action={
                    <CSVLink
                      data={report.map((row) => ({
                        ...row,
                        manager_order_id: row.manager_order_id || 'Desconocido',
                        store: row.store.name,
                        created_at: format(
                          new Date(row.created_at),
                          'dd/MM/yyyy HH:mm:ss',
                          {
                            locale: es,
                          },
                        ),
                        status: row.status.name,
                        payment_method: row.payment.method.name,
                        psp_reference:
                          row.payment?.psp_reference || 'Desconocido',
                        lines: row.lines.length,
                        grand_total: numeral(row.grand_total).format('$0,0.00'),
                      }))}
                      headers={[
                        { label: 'ID', key: 'id' },
                        { label: 'Pedido', key: 'order_number' },
                        { label: 'ERP ID', key: 'manager_order_id' },
                        { label: 'Tienda', key: 'store' },
                        { label: 'Fecha', key: 'created_at' },
                        { label: 'Estado', key: 'status' },
                        { label: 'Método de pago', key: 'payment_method' },
                        { label: 'Transaction ID', key: 'payment_reference' },
                        {
                          label: 'PSP Reference',
                          key: 'psp_reference',
                        },
                        { label: 'Productos', key: 'lines' },
                        { label: 'Importe', key: 'grand_total' },
                      ]}
                      filename={`reporte-contabilidad-${formatDate(
                        new Date(filters.createdAtFrom),
                      )}-${formatDate(new Date(filters.createdAtTo))}.csv`}
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
                          <TableCell>ID</TableCell>
                          <TableCell>Pedido</TableCell>
                          <TableCell>ERP ID</TableCell>
                          <TableCell>Tienda</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Método de pago</TableCell>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>PSP Reference</TableCell>
                          <TableCell align="center">Productos</TableCell>
                          <TableCell>Importe</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.order_number}</TableCell>
                            <TableCell>
                              {row.manager_order_id || 'Desconocido'}
                            </TableCell>
                            <TableCell>{row.store.name}</TableCell>
                            <TableCell>
                              {format(
                                new Date(row.created_at),
                                'dd/MM/yyyy HH:mm:ss',
                                {
                                  locale: es,
                                },
                              )}
                            </TableCell>
                            <TableCell>{row.status.name}</TableCell>
                            <TableCell>{row.payment.method.name}</TableCell>
                            <TableCell>{row.payment_reference}</TableCell>
                            <TableCell>
                              {row.payment?.psp_reference || 'Desconocido'}
                            </TableCell>
                            <TableCell align="center">
                              {row.lines.length}
                            </TableCell>
                            <TableCell>
                              {numeral(row.grand_total).format('$0,0.00')}
                            </TableCell>
                          </TableRow>
                        ))}
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
