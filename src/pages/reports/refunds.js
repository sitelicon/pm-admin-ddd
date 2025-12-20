import { useCallback, useEffect, useState } from 'react';
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
import { categoriesApi } from '../../api/categories';

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
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useLocalStorage('salesReportFilters', {
    category: undefined,
    reference: undefined,
    dateField: 'created_at',
    from: undefined,
    to: undefined,
    interval: 'daily',
    storeId: undefined,
  });

  const handleStoreIdChange = (event) => {
    const { value } = event.target;

    setFilters((filters) => ({
      ...filters,
      storeId: value.length > 0 ? value : undefined,
    }));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;

    setFilters((filters) => ({
      ...filters,
      category: value.length > 0 ? value : undefined,
    }));
  };

  const generateReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getRefundsReport(filters);
      setFiltersOpen(false);
      setReport(response.data);
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

  const [categories, setCategories] = useState([]);
  const getCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategories();
      const filteredCategories = response.flatMap((category) =>
        category.data
          .filter((item) => item.language_id === 1)
          .map((item) => item.name),
      );
      setCategories(filteredCategories);
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <>
      <Head>
        <title>Reporte de devoluciones | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Reporte de devoluciones</Typography>
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
                    Devoluciones
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
                      value={filters.product}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          product: event.target.value,
                        }));
                      }}
                    ></TextField>
                  </PropertyListItem>
                  {/* <PropertyListItem align={align} divider label="Categoría">
                    <TextField
                      hiddenLabel
                      SelectProps={{ native: true }}
                      value={filters.category}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          category: event.target.value,
                        }));
                      }}
                    ></TextField>
                  </PropertyListItem> */}
                  <PropertyListItem align={align} divider label="Categoría">
                    <TextField
                      hiddenLabel
                      select
                      SelectProps={{ native: true }}
                      value={filters.category || ''}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Todas</option>
                      {categories.map((name, index) => (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      ))}
                    </TextField>
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
                  {/* <PropertyListItem align={align} divider label="Intervalo">
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
                  </PropertyListItem> */}
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
                      data={report.map((row) => ({
                        ...row,
                        //interval: formatDate(new Date(row.interval)),
                        return_total: numeral(row.return_total).format(
                          '$0,0.00',
                        ),
                        return_tax: numeral(row.return_tax).format('$0,0.00'),
                      }))}
                      headers={[
                        { label: 'orden', key: 'order' },
                        { label: 'Referencia', key: 'reference' },
                        { label: 'Productos devueltos', key: 'return_items' },
                        { label: 'Importe total', key: 'return_total' },
                        { label: 'Impuestos', key: 'return_tax' },
                      ]}
                      filename={`reporte-devoluciones-${formatDate(
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
                          <TableCell>Pedido</TableCell>
                          <TableCell align="center">Referencia</TableCell>
                          <TableCell align="center">Devoluciones</TableCell>
                          <TableCell align="center">
                            Productos Devueltos
                          </TableCell>
                          <TableCell>Importe total</TableCell>
                          <TableCell>Impuestos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.map((row) => (
                          <TableRow key={row.order} hover>
                            <TableCell>{row.order}</TableCell>
                            <TableCell>{row.reference}</TableCell>
                            <TableCell align="center">{row.returns}</TableCell>
                            <TableCell align="center">
                              {row.return_items}
                            </TableCell>
                            <TableCell>
                              {numeral(row.return_total).format('$0,0.00')}
                            </TableCell>
                            <TableCell>
                              {numeral(Math.abs(row.return_tax)).format(
                                '$0,0.00',
                              )}
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
