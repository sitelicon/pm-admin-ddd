import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { es } from 'date-fns/locale';
import { format, startOfYear } from 'date-fns';
import { useDebounce } from '@uidotdev/usehooks';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Alert,
  Link,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Card,
  Tooltip,
} from '@mui/material';
import {
  Building02,
  ChevronDown,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  Image01,
  Package,
  PackageCheck,
  PackageX,
  ShoppingBag01,
  Truck01,
} from '@untitled-ui/icons-react';
import moment from 'moment';
import { usePageView } from '../hooks/use-page-view';
import { useSettings } from '../hooks/use-settings';
import { Layout as DashboardLayout } from '../layouts/dashboard';
import { EcommerceSalesRevenue } from '../sections/ecommerce/ecommerce-sales-revenue';
import { EcommerceProducts } from '../sections/ecommerce/ecommerce-products';
import { EcommerceStats } from '../sections/ecommerce/ecommerce-stats';
import { productsApi } from '../api/products';
import { DateRangePicker } from '../components/date-range-picker';
import { paths } from '../paths';
import { useStores } from '../hooks/use-stores';
import { useLanguages } from '../hooks/use-languages';
import { SeverityPill } from '../components/severity-pill';
import { Scrollbar } from '../components/scrollbar';

const now = new Date();

const useDashboard = (from, to, storeId) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    topProducts: [],
    sales: 0,
    revenue: 0,
    orderUnits: 0,
    taxes: [],
    unrepliedReturnRequests: 0,
    duplicatedUrls: 0,
    duplicatedUrlsProducts: [],
    madeiraOrders: 0,
  });

  const fetchData = useCallback(async (dateFrom, dateTo, fromStore) => {
    try {
      setLoading(true);
      const response = await productsApi.getTopSellingProducts(
        moment(dateFrom).format('YYYY-MM-DD HH:mm'),
        moment(dateTo).format('YYYY-MM-DD HH:mm'),
        fromStore,
      );
      setState({
        sales: parseFloat(response.sales),
        revenue: parseFloat(response.revenue),
        saleUnits: response.saleUnits,
        orderUnits: response.orderUnits,
        unrepliedReturnRequests: response.unrepliedReturnRequests,
        taxes: response.taxFreeRequests,
        topProducts: response.topProducts.map(
          ({ total_qty_ordered, images, ...rest }) => ({
            ...rest,
            image:
              images.find(({ tag }) => tag === 'PRINCIPAL')?.url ||
              images[0].url,
            sales: total_qty_ordered,
          }),
        ),
        duplicatedUrls: response.duplicatedUrls.reduce((acc, curr) => {
          return acc + curr.total;
        }, 0),
        duplicatedUrlsProducts: response.duplicatedUrlsProducts,
        unreceivedPickupOrders: response.unreceivedPickupOrders,
        unshippedPickupOrders: response.unshippedPickupOrders,
        madeiraOrders: response.madeiraOrders,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(from, to, storeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, storeId]);

  return {
    dashboard: state,
    loading,
    refetch: () => fetchData(from, to, storeId),
  };
};

const statusMap = {
  pending: 'gray',
  payment_failed: 'error',
  under_packaging: 'warning',
  packaged: 'info',
  customer_shipped: 'info',
  shop_shipped: 'info',
  shop_received: 'info',
  delivered: 'success',
  canceled: 'error',
  refund_request: 'warning',
  refunded: 'success',
  refunded_multibank: 'success',
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', icon: <Clock /> };
    case 'payment_failed':
      return { label: 'Pago fallido', icon: <CreditCardX /> };
    case 'under_packaging':
      return { label: 'En preparación', icon: <ShoppingBag01 /> };
    case 'packaged':
      return { label: 'Preparado', icon: <Package /> };
    case 'customer_shipped':
      return { label: 'Enviado', icon: <Truck01 /> };
    case 'shop_shipped':
      return { label: 'En camino', icon: <Truck01 /> };
    case 'shop_received':
      return { label: 'En tienda', icon: <Building02 /> };
    case 'delivered':
      return { label: 'Entregado', icon: <PackageCheck /> };
    case 'canceled':
      return { label: 'Cancelado', icon: <PackageX /> };
    case 'refund_request':
      return { label: 'Devolución', icon: <FlipBackward /> };
    case 'refunded':
      return { label: 'Abonado', icon: <CreditCardCheck /> };
    case 'refunded_multibank':
      return { label: 'Abonado Multibanco', icon: <CreditCardCheck /> };
    default:
      return status;
  }
};

const Page = () => {
  const settings = useSettings();
  const storeAnchorEl = useRef(null);
  const graphAnchorEl = useRef(null);
  const languages = useLanguages();
  const [openUrlDuplicates, setOpenUrlDuplicates] = useState(false);
  const [openUnreceivedPickupOrders, setOpenUnreceivedPickupOrders] =
    useState(false);
  const [openUnshippedPickupOrders, setOpenUnshippedPickupOrders] =
    useState(false);
  const [openMadeiraOrders, setOpenMadeiraOrders] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [storeId, setStoreId] = useState(undefined);
  const stores = useStores();
  const [fromDate, setFromDate] = useState(startOfYear(now));
  const [toDate, setToDate] = useState(now);
  const debouncedFromDate = useDebounce(fromDate, 300);
  const debouncedToDate = useDebounce(toDate, 300);
  const { dashboard, loading, refetch } = useDashboard(
    debouncedFromDate,
    debouncedToDate,
    storeId,
  );

  const selectedStore = useMemo(
    () => stores.find(({ id }) => id === storeId),
    [stores, storeId],
  );
  usePageView();

  return (
    <>
      <Head>
        <title>Inicio | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Stack spacing={1}>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      Periodo:
                    </Typography>
                    <DateRangePicker
                      months={2}
                      startDate={new Date(fromDate)}
                      color="primary"
                      endDate={new Date(toDate)}
                      onChange={(startDate, endDate) => {
                        setFromDate(startDate);
                        setToDate(endDate);
                      }}
                    >
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography variant="button">
                          {format(new Date(fromDate), 'd MMM, yyyy', {
                            locale: es,
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                        <Typography variant="button">
                          {format(new Date(toDate), 'd MMM, yyyy', {
                            locale: es,
                          })}
                        </Typography>
                        <SvgIcon color="action" fontSize="small">
                          <ChevronDown />
                        </SvgIcon>
                      </Stack>
                    </DateRangePicker>
                    <Typography variant="overline" color="text.secondary">
                      Tienda:
                    </Typography>
                    <Button
                      ref={storeAnchorEl}
                      onClick={() => setStoreMenuOpen(true)}
                      color="inherit"
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="button" color="primary">
                          {selectedStore ? (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography variant="button" color="primary">
                                {selectedStore.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {selectedStore.code}
                              </Typography>
                            </Stack>
                          ) : (
                            'Todas las tiendas'
                          )}
                        </Typography>
                        <SvgIcon color="action" fontSize="small">
                          <ChevronDown />
                        </SvgIcon>
                      </Stack>
                    </Button>
                    <Menu
                      anchorEl={storeAnchorEl.current}
                      open={storeMenuOpen}
                      onClose={() => setStoreMenuOpen(false)}
                    >
                      <MenuItem
                        onClick={() => {
                          setStoreId(undefined);
                          setStoreMenuOpen(false);
                        }}
                        selected={storeId === undefined}
                      >
                        Todas las tiendas
                      </MenuItem>
                      {stores.map((store) => (
                        <MenuItem
                          key={store.id}
                          onClick={() => {
                            setStoreId(store.id);
                            setStoreMenuOpen(false);
                          }}
                          selected={storeId === store.id}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography variant="button">
                              {store.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {store.code.toUpperCase()}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Stack>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button
                    startIcon={
                      <SvgIcon>
                        <RefreshCcw01Icon />
                      </SvgIcon>
                    }
                    variant="outlined"
                    onClick={() => {
                      refetch();
                      graphAnchorEl.current.refetch();
                    }}
                  >
                    Refrescar datos
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} lg={7}>
              <Stack spacing={2}>
                {!loading && dashboard.madeiraOrders?.length > 0 && (
                  <>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <Button
                          type="button"
                          color="inherit"
                          size="small"
                          onClick={() => setOpenMadeiraOrders((prev) => !prev)}
                          sx={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {openMadeiraOrders
                            ? 'Ocultar pedidos'
                            : 'Ver pedidos'}
                        </Button>
                      }
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'error.lightest',
                      }}
                    >
                      Hay <strong>{dashboard.madeiraOrders.length}</strong>{' '}
                      pedido
                      {dashboard.madeiraOrders.length !== 1 ? 's' : ''} con
                      envío a Madeira sin gestionar envío
                    </Alert>
                    {openMadeiraOrders && (
                      <Card>
                        <Scrollbar>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Pedido</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Email</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboard.madeiraOrders.map((order) => {
                                const status = getStatusLabel(
                                  order.status.code,
                                );
                                const statusColor =
                                  statusMap[order.status.code] || 'warning';
                                return (
                                  <TableRow key={order.id}>
                                    <TableCell>
                                      <Link href={`/orders/${order.id}`}>
                                        {order.order_number}
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip
                                        placement="top"
                                        title={format(
                                          new Date(order.created_at),
                                          'P HH:mm:ss',
                                          {
                                            locale: es,
                                          },
                                        )}
                                      >
                                        <Stack spacing={0.5}>
                                          <Typography
                                            variant="body2"
                                            whiteSpace="nowrap"
                                          >
                                            {format(
                                              new Date(order.created_at),
                                              'dd MMMM, yyyy',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                          <Typography variant="body2">
                                            a las{' '}
                                            {format(
                                              new Date(order.created_at),
                                              'HH:mm',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                        </Stack>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <SeverityPill color={statusColor}>
                                        <SvgIcon
                                          fontSize="small"
                                          color="inherit"
                                          sx={{ mr: 0.5 }}
                                        >
                                          {status.icon}
                                        </SvgIcon>{' '}
                                        {status.label}
                                      </SeverityPill>
                                    </TableCell>
                                    <TableCell>
                                      {order.customer_email}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </Card>
                    )}
                  </>
                )}
                {!loading && dashboard.unrepliedReturnRequests > 0 && (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        component={NextLink}
                        href={paths.returns.index}
                        sx={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Ver solicitudes
                      </Button>
                    }
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'neutral.800'
                          : 'warning.lightest',
                    }}
                  >
                    Existe
                    {dashboard.unrepliedReturnRequests !== 1 ? 'n' : ''}{' '}
                    <strong>{dashboard.unrepliedReturnRequests}</strong>{' '}
                    solicitud
                    {dashboard.unrepliedReturnRequests !== 1 ? 'es' : ''} de
                    devolución sin responder.
                  </Alert>
                )}
                {!loading && dashboard.taxes.length > 0 && (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        component={NextLink}
                        href={paths.taxFree.index}
                        sx={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Ver solicitudes
                      </Button>
                    }
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'neutral.800'
                          : 'warning.lightest',
                    }}
                  >
                    Existe
                    {dashboard.taxes !== 1 ? 'n' : ''}{' '}
                    <strong>{dashboard.taxes.length}</strong> solicitud
                    {dashboard.taxes !== 1 ? 'es' : ''} de Tax Free sin
                    responder.
                  </Alert>
                )}
                {!loading && dashboard.duplicatedUrls > 0 && (
                  <>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <Button
                          type="button"
                          color="inherit"
                          size="small"
                          onClick={() => setOpenUrlDuplicates((prev) => !prev)}
                          sx={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {openUrlDuplicates
                            ? 'Ocultar duplicidades'
                            : 'Ver duplicidades'}
                        </Button>
                      }
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'error.lightest',
                      }}
                    >
                      Existe
                      {dashboard.duplicatedUrls !== 1 ? 'n' : ''}{' '}
                      <strong>{dashboard.duplicatedUrls}</strong> producto
                      {dashboard.duplicatedUrls !== 1 ? 's' : ''} con URL
                      {dashboard.duplicatedUrls !== 1 ? 's' : ''} duplicada
                      {dashboard.duplicatedUrls !== 1 ? 's' : ''}.
                    </Alert>
                    {openUrlDuplicates && (
                      <Card>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>URL</TableCell>
                              <TableCell align="center">Idioma</TableCell>
                              <TableCell>Productos</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dashboard.duplicatedUrlsProducts.map((url) => (
                              <TableRow key={url.url}>
                                <TableCell>{url.url}</TableCell>
                                <TableCell align="center">
                                  {languages
                                    .find(({ id }) => id === url.language_id)
                                    ?.iso?.toUpperCase() || url.language_id}
                                </TableCell>
                                <TableCell>
                                  {url.products.map(({ product }) => (
                                    <Stack
                                      key={product.id}
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ '&:not(:last-child)': { mb: 1 } }}
                                    >
                                      {product.image ? (
                                        <Box
                                          sx={{
                                            alignItems: 'center',
                                            backgroundColor: 'neutral.50',
                                            backgroundImage: `url(${product.image.url})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            borderRadius: 1,
                                            display: 'flex',
                                            height: 60,
                                            minHeight: 60,
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            width: 60,
                                            minWidth: 60,
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            alignItems: 'center',
                                            backgroundColor: 'neutral.50',
                                            borderRadius: 1,
                                            display: 'flex',
                                            height: 60,
                                            justifyContent: 'center',
                                            width: 60,
                                          }}
                                        >
                                          <SvgIcon>
                                            <Image01 />
                                          </SvgIcon>
                                        </Box>
                                      )}
                                      <Link
                                        variant="caption"
                                        display="block"
                                        href={`/products/${product.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {product.name?.value || product.sku}
                                      </Link>
                                    </Stack>
                                  ))}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    )}
                  </>
                )}
                {!loading && dashboard.unshippedPickupOrders?.length > 0 && (
                  <>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <Button
                          type="button"
                          color="inherit"
                          size="small"
                          onClick={() =>
                            setOpenUnshippedPickupOrders((prev) => !prev)
                          }
                          sx={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {openUnshippedPickupOrders
                            ? 'Ocultar pedidos'
                            : 'Ver pedidos'}
                        </Button>
                      }
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'error.lightest',
                      }}
                    >
                      Hay{' '}
                      <strong>{dashboard.unshippedPickupOrders.length}</strong>{' '}
                      pedido
                      {dashboard.unshippedPickupOrders.length !== 1
                        ? 's'
                        : ''}{' '}
                      con envío a tienda que lleva
                      {dashboard.unshippedPickupOrders.length !== 1
                        ? 'n'
                        : ''}{' '}
                      más de 1 día en estado <strong>En preparación</strong>.
                    </Alert>
                    {openUnshippedPickupOrders && (
                      <Card>
                        <Scrollbar>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Pedido</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Email</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboard.unshippedPickupOrders.map((order) => {
                                const status = getStatusLabel(
                                  order.status.code,
                                );
                                const statusColor =
                                  statusMap[order.status.code] || 'warning';
                                return (
                                  <TableRow key={order.id}>
                                    <TableCell>
                                      <Link href={`/orders/${order.id}`}>
                                        {order.order_number}
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip
                                        placement="top"
                                        title={format(
                                          new Date(order.created_at),
                                          'P HH:mm:ss',
                                          {
                                            locale: es,
                                          },
                                        )}
                                      >
                                        <Stack spacing={0.5}>
                                          <Typography
                                            variant="body2"
                                            whiteSpace="nowrap"
                                          >
                                            {format(
                                              new Date(order.created_at),
                                              'dd MMMM, yyyy',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                          <Typography variant="body2">
                                            a las{' '}
                                            {format(
                                              new Date(order.created_at),
                                              'HH:mm',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                        </Stack>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <SeverityPill color={statusColor}>
                                        <SvgIcon
                                          fontSize="small"
                                          color="inherit"
                                          sx={{ mr: 0.5 }}
                                        >
                                          {status.icon}
                                        </SvgIcon>{' '}
                                        {status.label}
                                      </SeverityPill>
                                    </TableCell>
                                    <TableCell>
                                      {order.customer_email}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </Card>
                    )}
                  </>
                )}
                {!loading && dashboard.unreceivedPickupOrders?.length > 0 && (
                  <>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <Button
                          type="button"
                          color="inherit"
                          size="small"
                          onClick={() =>
                            setOpenUnreceivedPickupOrders((prev) => !prev)
                          }
                          sx={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {openUnreceivedPickupOrders
                            ? 'Ocultar pedidos'
                            : 'Ver pedidos'}
                        </Button>
                      }
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'error.lightest',
                      }}
                    >
                      Hay{' '}
                      <strong>{dashboard.unreceivedPickupOrders.length}</strong>{' '}
                      pedido
                      {dashboard.unreceivedPickupOrders.length !== 1
                        ? 's'
                        : ''}{' '}
                      con envío a tienda que lleva
                      {dashboard.unshippedPickupOrders.length !== 1
                        ? 'n'
                        : ''}{' '}
                      más de 10 días en estado <strong>En camino</strong> desde
                      que se enviaron.
                    </Alert>
                    {openUnreceivedPickupOrders && (
                      <Card>
                        <Scrollbar>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Pedido</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Email</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dashboard.unreceivedPickupOrders.map((order) => {
                                const status = getStatusLabel(
                                  order.status.code,
                                );
                                const statusColor =
                                  statusMap[order.status.code] || 'warning';
                                return (
                                  <TableRow key={order.id}>
                                    <TableCell>
                                      <Link href={`/orders/${order.id}`}>
                                        {order.order_number}
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip
                                        placement="top"
                                        title={format(
                                          new Date(order.created_at),
                                          'P HH:mm:ss',
                                          {
                                            locale: es,
                                          },
                                        )}
                                      >
                                        <Stack spacing={0.5}>
                                          <Typography
                                            variant="body2"
                                            whiteSpace="nowrap"
                                          >
                                            {format(
                                              new Date(order.created_at),
                                              'dd MMMM, yyyy',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                          <Typography variant="body2">
                                            a las{' '}
                                            {format(
                                              new Date(order.created_at),
                                              'HH:mm',
                                              {
                                                locale: es,
                                              },
                                            )}
                                          </Typography>
                                        </Stack>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                      <SeverityPill color={statusColor}>
                                        <SvgIcon
                                          fontSize="small
                                        "
                                          color="inherit"
                                          sx={{ mr: 0.5 }}
                                        >
                                          {status.icon}
                                        </SvgIcon>{' '}
                                        {status.label}
                                      </SeverityPill>
                                    </TableCell>
                                    <TableCell>
                                      {order.customer_email}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </Card>
                    )}
                  </>
                )}
                <EcommerceStats
                  loading={loading}
                  sales={dashboard.sales}
                  revenue={dashboard.revenue}
                  saleUnits={dashboard.saleUnits}
                  orderUnits={dashboard.orderUnits}
                />
                <EcommerceSalesRevenue
                  ref={graphAnchorEl}
                  storeId={storeId}
                  from={debouncedFromDate}
                  to={debouncedToDate}
                />
              </Stack>
            </Grid>
            <Grid xs={12} lg={5}>
              <Stack spacing={2}>
                <EcommerceProducts
                  products={dashboard.topProducts}
                  loading={loading}
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
