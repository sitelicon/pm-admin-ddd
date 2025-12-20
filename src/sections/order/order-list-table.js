import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CSVLink } from 'react-csv';
import numeral from 'numeral';
import {
  AvatarGroup,
  Box,
  Button,
  Checkbox,
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
import {
  Building02,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  Package,
  PackageCheck,
  PackageX,
  ShoppingBag01,
  Truck01,
  XCircle,
} from '@untitled-ui/icons-react';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { ordersApi } from '../../api/orders';

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
    case 'returned':
      return { label: 'Devuelto', icon: <FlipBackward /> };
    case 'refunded':
      return { label: 'Abonado', icon: <CreditCardCheck /> };
    case 'incidence':
      return { label: 'Incidencia', icon: <XCircle /> };
    case 'refunded_multibank':
      return { label: 'Abonado Multibanco', icon: <CreditCardCheck /> };
    default:
      return status;
  }
};

export const OrderListTable = (props) => {
  const {
    currentOrder,
    onOrderSelect,
    onPageChange,
    onPerPageChange,
    orders,
    ordersCount,
    page,
    perPage,
    loading,
    ...other
  } = props;
  const csvLinkRef = useRef(null);
  const csvLinkRef2 = useRef(null);
  const [exportOrders, setExportOrders] = useState([]);
  const [typeExport, setTypeExport] = useState('normal');
  const [downloading, setDownloading] = useState(false);
  const [exportOrdersLockers, setExportOrdersLockers] = useState([]);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(orders);
  const [enablingOrders, setEnablingOrders] = useState(false);
  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const handleEnableSelected = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          `¿Desea exportar ${selected.length} ordenes seleccionados?`,
        )
      ) {
        try {
          const exported = [];
          selected.map((id) => {
            const order = orders.find((order) => order.id === id);
            exported.push(order);
          });
          setTypeExport('normal');
          setExportOrders(exported);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [selected, orders],
  );

  const handleLockersEnableSelected = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          `¿Desea exportar ${selected.length} ordenes de lockers seleccionados?`,
        )
      ) {
        try {
          const exported = [];
          selected.map((id) => {
            const order = orders.find((order) => order.id === id);
            exported.push(order);
          });
          setTypeExport('lockers');
          setExportOrdersLockers(exported);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [selected, orders],
  );

  useEffect(() => {
    if (!downloading && csvLinkRef.current && exportOrders.length > 0) {
      csvLinkRef.current.link.click();
    }
    if (!downloading && csvLinkRef2.current && exportOrdersLockers.length > 0) {
      csvLinkRef2.current.link.click();
    }
  }, [exportOrders, exportOrdersLockers, downloading]);

  const selectedAll = selected.length === orders.length;
  const selectedSome = selected.length > 0 && selected.length < orders.length;
  const enableBulkActions = selected.length > 0;

  const dataExport = useMemo(() => {
    switch (typeExport) {
      case 'lockers':
        return exportOrdersLockers.map((order) => ({
          ...order,
          lockerID:
            order.shipping_type === 'locker' ? order.pickup_locker_id : '',
          remitente: 'Paco Martinez',
          customer: `${order.customer_firstname}${
            order.customer_lastname ? ` ${order.customer_lastname}` : ''
          }`,
          shipping:
            order.shipping_type === 'pickup' ? '' : `${order.shipping_address}`,
          poblacion: order.shipping_locality,
          cp: order.shipping_cp,
          pais: order.shipping_country,
          phone: order.billing_phone ?? order.shipping_phone,
          email: order.customer_email,
          type: 'R',
          relay: '24R',
          bultos: '1',
          peso: '0.5',
        }));
      default:
        return exportOrders.flatMap((order) => {
          return order.lines.map((line) => ({
            ...order,
            created_at: format(
              new Date(order.created_at),
              'MMM d, yyyy hh:mm:ss a',
              {
                locale: es,
              },
            ),
            status: order.status.name,
            customer: `${order.customer_firstname}${
              order.customer_lastname ? ` ${order.customer_lastname}` : ''
            }`,
            email: order.customer_email,
            grand_total: numeral(order.grand_total).format('$0,0.00'),
            subtotal: numeral(order.subtotal).format('0,0.00'),
            amount: numeral(order.subtotal).format('0,0.00'),
            amount_to_invoice: numeral(order.subtotal * 0.1).format('0,0.00'),
            shipping_type:
              order.shipping_type === 'pickup'
                ? `Recogida en tienda - ${order.shipping_name.replace(
                    /PACOMARTINEZ - /g,
                    '',
                  )}`
                : order.shipping_type === 'locker'
                ? `Recogida en Locker - ${
                    order.pickup_locker_id || 'Desconocido'
                  }`
                : 'A domicilio',
            products: `${line.qty_ordered}x${line.product.reference} - ${line.product.color?.name_admin}`,
            sku: line.product.sku,
            cp: order.shipping_cp,
            city: order.shipping_locality,
            phone: order.shipping_phone ?? order.billing_phone,
            shipping:
              order.shipping_type === 'pickup'
                ? ''
                : `${order.shipping_address}`,
            lockerID:
              order.shipping_type === 'locker' ? order.pickup_locker_id : '',
          }));
        });
    }
  }, [exportOrders, exportOrdersLockers]);

  const handleICGExport = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (
          window.confirm(
            `¿Desea sincronizar ${selected.length} ordenes seleccionadas con ICG?`,
          )
        ) {
          setEnablingOrders(true);
          await ordersApi.uploadOrdersToICG({ orders: selected });
          setEnablingOrders(false);
          deselectAll();
        }
      } catch (error) {
        console.error('Error al sincronizar con ICG:', error);
        setEnablingOrders(false);
      }
    },
    [deselectAll, selected],
  );

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {/* Botón temporal para sincronizar con ICG, a pedido de Ana */}
      <Button
        size="small"
        color="black"
        variant="contained"
        onClick={handleICGExport}
        sx={{
          position: 'absolute',
          top: -50,
          right: 16,
          zIndex: 20, // por encima de las bulk actions
          minWidth: 140,
        }}
      >
        Sincronizar ICG
      </Button>
      {/* <Scrollbar style={{ maxHeight: 'calc(100vh - 347px)' }}> */}
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button
            color="primary"
            size="small"
            onClick={handleEnableSelected}
            disabled={enablingOrders}
          >
            {enablingOrders ? 'Exportando...' : 'Exportar'}
          </Button>
          <Button
            color="primary"
            size="small"
            onClick={handleLockersEnableSelected}
            disabled={enablingOrders}
          >
            {enablingOrders ? 'Exportando...' : 'Exportar Lockers'}
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Pedido #</TableCell>
              <TableCell>ERP ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tienda</TableCell>
              {/* <TableCell>Facturar a</TableCell> */}
              <TableCell>Enviar a</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Merchant Reference</TableCell>
              {/* <TableCell>Mailchimp</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow hover key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
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
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
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
                <TableCell colSpan={12}>
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
            {orders.length > 0 && (
              <>
                <CSVLink
                  ref={csvLinkRef}
                  data={dataExport}
                  asyncOnClick={true}
                  headers={[
                    { label: 'Num. de pedido', key: 'order_number' },
                    { label: 'Comprado el', key: 'created_at' },
                    { label: 'Enviar a nombre', key: 'customer' },
                    { label: 'Email', key: 'email' },
                    { label: 'Total (comprado)', key: 'grand_total' },
                    { label: 'Estado', key: 'status' },
                    { label: 'Métodos de envío', key: 'shipping_type' },
                    { label: 'SIN IVA', key: 'subtotal' },
                    { label: 'EN VALOR', key: 'amount' },
                    {
                      label: 'IMPORTE A FACTURAR',
                      key: 'amount_to_invoice',
                    },

                    { label: 'Producto', key: 'products' },
                    { label: 'SKU', key: 'sku' },
                    { label: 'Información de envío', key: 'shipping' },
                    { label: 'Código Postal', key: 'cp' },
                    { label: 'Ciudad', key: 'city' },
                    { label: 'Teléfono', key: 'phone' },
                    { label: 'LockerID', key: 'lockerID' },
                  ]}
                  filename={`pedidos-paco-martinez.csv`}
                />
                <CSVLink
                  ref={csvLinkRef2}
                  data={dataExport}
                  asyncOnClick={true}
                  headers={[
                    { label: 'LOCKER ID', key: 'lockerID' },
                    { label: 'PEDIDO', key: 'order_number' },
                    { label: 'REMITENTE', key: 'remitente' },
                    { label: 'CLIENTE', key: 'customer' },
                    { label: '', key: '' },
                    { label: 'DIRECCION 32 CARACTERES', key: 'shipping' },
                    { label: 'DIRECION1', key: '' },
                    { label: 'POBLACION', key: 'poblacion' },
                    { label: 'CODIGO POSTAL', key: 'cp' },
                    { label: 'PAIS', key: 'pais' },
                    {
                      label: 'TELEFONO SIEMPRE (+) CON PREFIJO, SIN ESPACIO',
                      key: 'phone',
                    },
                    { label: '', key: '' },
                    { label: 'EMAIL', key: 'email' },
                    { label: '', key: '' },
                    { label: '', key: '' },
                    { label: '', key: '' },
                    { label: 'DOMICILIO/RELAY', key: 'type' },
                    { label: 'LOCKER ID', key: 'lockerID' },
                    { label: 'PAIS', key: 'pais' },
                    { label: 'DOMICILIO/24R', key: 'relay' },
                    { label: 'BULTO', key: 'bultos' },
                    { label: 'PESO', key: 'peso' },
                  ]}
                  filename={`pedidos-lockers-paco-martinez.csv`}
                />
              </>
            )}
            {!loading &&
              orders.map((order) => {
                const isSelected = selected.includes(order.id);
                const status = getStatusLabel(order.status.code);
                const statusColor = statusMap[order.status.code] || 'warning';

                return (
                  <TableRow
                    hover
                    key={order.id}
                    onClick={() => onOrderSelect?.(order.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(order.id);
                          } else {
                            deselectOne(order.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>{order.order_number}</TableCell>
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
                    <TableCell>
                      {order.customer?.name ? (
                        `${order.customer.name}${
                          order.customer?.last_name
                            ? ` ${order.customer.last_name}`
                            : ''
                        }`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.customer_is_guest ? (
                        <Typography color="text.secondary" variant="body2">
                          Invitado
                        </Typography>
                      ) : (
                        order.customer.group.name
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
                    <TableCell>{order.payment_reference}</TableCell>
                    {/* <TableCell>
                      <Stack direction="column" alignItems="center" spacing={1}>
                        <SvgIcon fontSize="small" color="success">
                          <CheckCircleBroken />
                        </SvgIcon>
                        <Typography color="text.secondary" variant="caption">
                          Sincronizado
                        </Typography>
                      </Stack>
                    </TableCell> */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={ordersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[25, 50, 100, 250, 500]}
        labelRowsPerPage="Pedidos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  );
};

OrderListTable.propTypes = {
  onOrderSelect: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  orders: PropTypes.array.isRequired,
  ordersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};
