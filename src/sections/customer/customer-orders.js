import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import {
  Building02,
  CheckCircleBroken,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  HeartHand,
  Package,
  PackageCheck,
  PackageX,
  ReceiptCheck,
  ShoppingBag01,
  Truck01,
  XCircle,
  XClose,
} from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { ordersApi } from '../../api/orders';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useDebounce } from '@uidotdev/usehooks';

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

const useSearch = (customerId) => {
  const [search, setSearch] = useState({
    filters: {
      search: undefined,
      statusId: undefined,
      storeId: undefined,
      erpId: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      customerId,
    },
    page: 0,
    perPage: 25,
    sortBy: 'created_at',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useOrders = (search) => {
  const [state, setState] = useState({
    orders: [],
    ordersCount: 0,
    loading: true,
  });

  const getOrders = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await ordersApi.getOrders(search);
      setState({
        orders: response.data,
        ordersCount: response.total,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [search]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return state;
};

export const CustomerOrders = (props) => {
  const { customerId, ...other } = props;

  const { search, updateSearch } = useSearch(customerId);
  const debouncedSearch = useDebounce(search, 300);
  const { orders, ordersCount, loading } = useOrders(debouncedSearch);

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },
    [updateSearch],
  );

  const handleSortChange = useCallback(
    (sortDir) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortDir,
      }));
    },
    [updateSearch],
  );

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
    <Box sx={{ position: 'relative' }} {...other}>
      {/* <Scrollbar style={{ maxHeight: 'calc(100vh - 347px)' }}> */}
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pedido #</TableCell>
              <TableCell>ERP ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Enviar a</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Mailchimp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={40}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                    }}
                  >
                    <Typography color="textPrimary" variant="body2">
                      No se encontraron pedidos que coincidan con los filtros
                      seleccionados, por favor intente nuevamente.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              orders.map((order) => {
                const status = getStatusLabel(order.status.code);
                const statusColor = statusMap[order.status.code] || 'warning';

                return (
                  <TableRow hover key={order.id}>
                    <TableCell>
                      <Link component={NextLink} href={`/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {order.manager_order_id || (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
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
                          <Typography variant="body2" whiteSpace="nowrap">
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
                            {format(new Date(order.created_at), 'HH:mm', {
                              locale: es,
                            })}
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
                      {order.store ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">
                            {order.store.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.store.code.toUpperCase()}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.shipping_name ? (
                        `${order.shipping_name} ${
                          order.shipping_last_name || ''
                        }`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {order.lines.length === 0 && (
                        <Typography color="text.secondary" variant="caption">
                          Ninguno
                        </Typography>
                      )}
                      {order.lines.length > 0 && (
                        <AvatarGroup
                          max={3}
                          spacing="small"
                          total={order.lines.length}
                          variant="rounded"
                          component={({ children, ...rest }) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'start',
                              }}
                              {...rest}
                            >
                              {children}
                            </Box>
                          )}
                        >
                          {order.lines.slice(0, 3).map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                              }}
                            >
                              <Tooltip
                                arrow
                                title={item.product.name?.value}
                                placement="top"
                              >
                                <Box
                                  key={item.id}
                                  sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'neutral.50',
                                    backgroundImage: `url(${
                                      item.product.images.find(
                                        ({ tag }) => tag === 'PRINCIPAL',
                                      )?.url
                                    })`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    borderRadius: 1,
                                    display: 'flex',
                                    height: 40,
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    width: 40,
                                    border: '2px solid #fff',
                                    boxSizing: 'content-box',
                                    // marginLeft: '-8px',
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          ))}
                        </AvatarGroup>
                      )}
                    </TableCell>
                    <TableCell>
                      {numeral(order.grand_total).format('$0,0.00')}
                    </TableCell>
                    <TableCell>
                      <Stack direction="column" alignItems="center" spacing={1}>
                        <SvgIcon fontSize="small" color="success">
                          <CheckCircleBroken />
                        </SvgIcon>
                        <Typography color="text.secondary" variant="caption">
                          Sincronizado
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={ordersCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePerPageChange}
        page={search.page}
        rowsPerPage={search.perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Pedidos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  );
};

CustomerOrders.propTypes = {
  customerId: PropTypes.number.isRequired,
};
