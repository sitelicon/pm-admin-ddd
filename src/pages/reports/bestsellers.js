import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  format,
  parseISO,
  parse,
  startOfISOWeek,
  addDays,
  isValid,
} from 'date-fns';
import { es } from 'date-fns/locale';
import numeral from 'numeral';
import { toast } from 'react-hot-toast';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';
import { ChevronRight } from '@mui/icons-material';
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
import { categoriesApi } from '../../api/categories';
import { reportsApi } from '../../api/reports';
import { Scrollbar } from '../../components/scrollbar';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useAuth } from '../../hooks/use-auth';

const intervalOptions = [
  {
    label: 'Diario',
    value: 'daily',
  },
  {
    label: 'Semanal',
    value: 'weekly',
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

const useCategories = () => {
  const [state, setState] = useState({
    categories: [],
    categoriesCount: 0,
    loading: true,
  });

  const getCategories = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await categoriesApi.getCategories();
      setState({
        categories: response,
        categoriesCount: response.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return { ...state, refetch: getCategories };
};

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const { user } = useAuth();
  const stores = useStores();
  const { categories } = useCategories();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useLocalStorage('bestsellersReportFilters', {
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

  const generateReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getBestsellersReport(filters);
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

  const [reporter, setReporter] = useState(null);
  const genera = useCallback(async () => {
    try {
      const response = await reportsApi.getProductsReport();
      setReporter(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const formatDate = useCallback(
    (date) => {
      if (!date) return '';
      if (typeof date === 'string' && date.includes('W')) {
        const parsed = parse(date, "RRRR-'W'II", new Date());
        if (!isValid(parsed)) return date;

        const start = startOfISOWeek(parsed);
        const end = addDays(start, 6);
        return `Semana ${format(start, 'dd/MM', { locale: es })} - ${format(
          end,
          'dd/MM/yyyy',
          { locale: es },
        )}`;
      }

      const parsedDate = typeof date === 'string' ? parseISO(date) : date;

      switch (filters.interval) {
        case 'daily':
          return format(parsedDate, 'dd/MM/yyyy', { locale: es });
        case 'weekly':
          const start = startOfISOWeek(parsedDate);
          const end = addDays(start, 6);
          return `Semana ${format(start, 'dd/MM', { locale: es })} - ${format(
            end,
            'dd/MM/yyyy',
            { locale: es },
          )}`;
        case 'monthly':
          return format(parsedDate, 'MMMM yyyy', { locale: es });
        case 'yearly':
          return format(parsedDate, 'yyyy', { locale: es });
        default:
          return '';
      }
    },
    [filters.interval],
  );

  const parseDate = useCallback((interval) => {
    if (!interval) return null;

    if (typeof interval === 'string' && interval.includes('W')) {
      return parse(interval, "RRRR-'W'II", new Date());
    }

    if (/^\d{4}-\d{2}$/.test(interval)) {
      return parse(interval, 'yyyy-MM', new Date());
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(interval)) {
      return parseISO(interval);
    }

    if (/^\d{4}$/.test(interval)) {
      return new Date(parseInt(interval), 0, 1);
    }

    return parseISO(interval);
  }, []);

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <>
      <Head>
        <title>Reporte de bestsellers | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Reporte de bestsellers</Typography>
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
                    Bestsellers
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
                  {/* categories */}
                  <PropertyListItem align={align} divider label="Categoría">
                    <TextField
                      hiddenLabel
                      select
                      SelectProps={{ native: true }}
                      value={filters.categoryId || ''}
                      onChange={(event) => {
                        setFilters((filters) => ({
                          ...filters,
                          categoryId: event.target.value,
                        }));
                      }}
                    >
                      <option value="">Todas</option>
                      {categories.map((category) => (
                        <>
                          <option key={category.id} value={category.id}>
                            {category.data[0].name}
                          </option>
                          {category.children &&
                            category.children.map((child) => (
                              <option key={child.id} value={child.id}>
                                {`${category.data[0].name} -> ${child.data[0].name}`}
                              </option>
                            ))}
                        </>
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
                {user.email === 'desarrollos@sitelicon.com' && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={genera}
                    disabled={loading}
                  >
                    TEST
                  </Button>
                )}
              </Stack>
            </Card>
            {report && (
              <Card>
                <CardHeader
                  title="Reporte"
                  subheader="Reporte de bestsellers generado"
                  action={
                    <CSVLink
                      separator={';'}
                      data={report.flatMap((row) =>
                        row.categories.flatMap((category) =>
                          category.bestsellers.map((bestseller) => ({
                            interval: formatDate(
                              new Date(parseDate(row.interval)),
                            ),
                            category_group: category.category_group,
                            product:
                              bestseller.product &&
                              bestseller.product.includes('"')
                                ? `"${bestseller.product.replace(/"/g, '""')}"`
                                : bestseller.product,
                            product_ref: bestseller.product_sku,
                            product_color: bestseller.product_color,
                            qty: bestseller.qty,
                            total: numeral(bestseller.total).format('$0,0.00'),
                          })),
                        ),
                      )}
                      headers={[
                        { label: 'Intervalo', key: 'interval' },
                        { label: 'Grupo categoría', key: 'category_group' },
                        { label: 'Sku', key: 'product_ref' },
                        { label: 'Producto', key: 'product' },
                        { label: 'Color', key: 'product_color' },
                        { label: 'Cantidad', key: 'qty' },
                        { label: 'Importe total', key: 'total' },
                      ]}
                      filename={`reporte-bestsellers-${formatDate(
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
                          <TableCell>Intervalo</TableCell>
                          <TableCell>Grupo categoría</TableCell>
                          <TableCell>Sku</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell>Color</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell>Importe total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.map((row) =>
                          row.categories.map((category) => {
                            const [first, ...rest] = category.bestsellers;

                            return (
                              <>
                                <TableRow
                                  key={`${row.interval}-${first.product}`}
                                >
                                  <TableCell
                                    rowSpan={category.bestsellers.length}
                                  >
                                    {formatDate(
                                      new Date(parseDate(row.interval)),
                                    )}
                                  </TableCell>
                                  <TableCell
                                    rowSpan={category.bestsellers.length}
                                  >
                                    {category.category_group}
                                  </TableCell>
                                  <TableCell>{first.product_sku}</TableCell>
                                  <TableCell>
                                    <a
                                      target="_blank"
                                      href={`/products/${first.product_id}`}
                                    >
                                      {first.product}
                                    </a>
                                  </TableCell>
                                  <TableCell>{first.product_color}</TableCell>
                                  <TableCell align="center">
                                    {first.qty}
                                  </TableCell>
                                  <TableCell>
                                    {numeral(first.total).format('$0,0.00')}
                                  </TableCell>
                                </TableRow>

                                {rest.map((bestseller) => (
                                  <TableRow
                                    key={`${row.interval}-${bestseller.product}`}
                                  >
                                    <TableCell>
                                      {bestseller.product_sku}
                                    </TableCell>
                                    <TableCell>
                                      <a
                                        target="_blank"
                                        href={`/products/${bestseller.product_id}`}
                                      >
                                        {bestseller.product}
                                      </a>
                                    </TableCell>
                                    <TableCell>
                                      {bestseller.product_color}
                                    </TableCell>
                                    <TableCell align="center">
                                      {bestseller.qty}
                                    </TableCell>
                                    <TableCell>
                                      {numeral(bestseller.total).format(
                                        '$0,0.00',
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            );
                          }),
                        )}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </CardContent>
              </Card>
            )}

            {reporter && (
              <Card>
                <CardHeader
                  title="Reporte"
                  subheader="Reporte oculto"
                  action={
                    <CSVLink
                      separator={';'}
                      data={reporter.reduce((acc, row) => {
                        return [
                          ...acc,
                          {
                            sku: row.sku,
                            url:
                              'https://www.pacomartinez.com/es/' + row.url.url,
                            color: row.color.colordata[0].label,
                            precio:
                              row.price.price_discount_start > new Date() &&
                              row.price.price_discount_end < new Date()
                                ? row.price_discount
                                : row.price.price,
                            imagenes: row.images
                              .map((image) => image.url + ',  ')
                              .join(''),
                          },
                        ];
                      }, [])}
                      headers={[
                        { label: 'SKU', key: 'sku' },
                        { label: 'URL', key: 'url' },
                        { label: 'COLOR', key: 'color' },
                        { label: 'PRECIO', key: 'precio' },
                        { label: 'IMAGENES', key: 'imagenes' },
                      ]}
                      filename={`report-paula.csv`}
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
                  {/* <Scrollbar>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SKU</TableCell>
                          <TableCell>URL</TableCell>
                          <TableCell>COLOR</TableCell>
                          <TableCell>PRECIO</TableCell>
                          <TableCell>IMAGENES</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reporter.map((bestseller) => (
                          <TableRow
                            key={`${bestseller.sku}-${bestseller.url.url}`}
                            hover
                          >
                            <TableCell>{bestseller.sku}</TableCell>
                            <TableCell>
                              <a
                                target="_blank"
                                href={`https://www.pacomartinez.com/es/${bestseller.url.url}`}
                              >
                                {bestseller.url.url}
                              </a>
                            </TableCell>
                            <TableCell>{bestseller.color.name_admin}</TableCell>
                            <TableCell>{bestseller.price}</TableCell>
                            <TableCell>
                              {bestseller.images.map((image, key) => (
                                <h3 key={key}>{image.url.url}</h3>
                              ))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar> */}
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
