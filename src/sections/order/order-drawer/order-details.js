import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import numeral from 'numeral';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Link,
  MenuItem,
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
import { PropertyList } from '../../../components/property-list';
import { PropertyListItem } from '../../../components/property-list-item';
import { SeverityPill } from '../../../components/severity-pill';
import { Scrollbar } from '../../../components/scrollbar';
import { ordersApi } from '../../../api/orders';
import { getCustomerErpId } from '../../../utils/get-customer-erp-id';
import { useAuth } from '../../../hooks/use-auth';

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

const statusOptions = [
  { id: 1, label: 'Pendiente', icon: <Clock />, color: 'info' },
  { id: 2, label: 'Pago fallido', icon: <CreditCardX />, color: 'error' },
  { id: 3, label: 'En preparación', icon: <ShoppingBag01 />, color: 'warning' },
  { id: 4, label: 'Preparado', icon: <Package />, color: 'info' },
  { id: 5, label: 'Enviado', icon: <Truck01 />, color: 'info' },
  { id: 6, label: 'En camino', icon: <Truck01 />, color: 'info' },
  { id: 7, label: 'En tienda', icon: <Building02 />, color: 'info' },
  { id: 8, label: 'Entregado', icon: <PackageCheck />, color: 'success' },
  { id: 9, label: 'Cancelado', icon: <PackageX />, color: 'error' },
  // { id: 10, label: 'Devolución', icon: <FlipBackward />, color: 'warning' },
  { id: 11, label: 'Abonado', icon: <CreditCardCheck />, color: 'success' },
  { id: 16, label: 'Con incidencia', icon: <XCircle />, color: 'error' },
  { id: 17, label: 'Devolución', icon: <FlipBackward />, color: 'warning' },
  {
    id: 18,
    label: 'Abonado Multibanco',
    icon: <CreditCardCheck />,
    color: 'success',
  },
];

const shippingProviderOptions = [
  { id: 1, label: 'GLS', diabled: false },
  { id: 2, label: 'SEUR', disabled: true },
  { id: 3, label: 'CTT', disabled: true },
  { id: 4, label: 'Correos Express', disabled: false },
];

export const OrderDetails = (props) => {
  const { user } = useAuth();
  const { order, onClose } = props;
  const [updating, setUpdating] = useState(false);
  const [updatingShippingProvider, setUpdatingShippingProvider] =
    useState(false);
  const [status, setStatus] = useState(
    statusOptions.find(({ id }) => id === order.status.id),
  );
  const [shippingProvider, setShippingProvider] = useState(
    shippingProviderOptions.find(
      ({ id }) => id === order.shipping_provider?.id,
    ),
  );
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const pspReferencePayment = useMemo(() => {
    if (order.payment_authorization) {
      const pspReference = order.payment_authorization.comment.match(
        /pspReference: (.*?) <br \/> paymentMethod:/,
      );
      return pspReference ? pspReference[1] : '';
    }
    return '';
  }, [order.payment_authorization]);

  useEffect(() => {
    setStatus(statusOptions.find(({ id }) => id === order.status.id));
  }, [order]);

  const handleStatusChange = useCallback((event) => {
    setStatus(
      statusOptions.find(
        (option) => option.id.toString() === event.target.value.toString(),
      ),
    );
  }, []);

  const handleShippingProviderChange = useCallback((event) => {
    setShippingProvider(
      shippingProviderOptions.find(
        (option) => option.id.toString() === event.target.value.toString(),
      ),
    );
  }, []);

  const updateStatus = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdating(true);
        await ordersApi.updateOrderStatus(order.id, status.id);
        toast.success('Estado del pedido actualizado');
      } catch (error) {
        console.error(error);
        toast.error(
          'No se pudo actualizar el estado del pedido: ' + error.message,
        );
      } finally {
        setUpdating(false);
      }
    },
    [order, status],
  );

  const updateShippingProvider = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingShippingProvider(true);
        await ordersApi.updateOrderShippingProvider(
          order.id,
          shippingProvider.id,
        );
        toast.success('Transportista del pedido actualizado');
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar el transportista del pedido');
      } finally {
        setUpdatingShippingProvider(false);
      }
    },
    [order, shippingProvider],
  );

  const align = lgUp ? 'horizontal' : 'vertical';
  const items = order.lines || [];
  const createdAt = format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', {
    locale: es,
  });
  const totalAmount = numeral(order.grand_total || 0).format(`$0,0.00`);
  const baseAmount = numeral(order.base_subtotal_incl_tax || 0).format(
    `$0,0.00`,
  );
  const shippingAmount = numeral(order.shipping_incl_tax || 0).format(
    `$0,0.00`,
  );
  const baseDiscountAmount = numeral(
    Math.abs(order.base_discount_amount),
  ).format(`$0,0.00`);
  const earnedPoints = order.lines.reduce(
    (acc, item) => acc + item.mp_reward_earn,
    0,
  );
  const finalEarnedPoints =
    earnedPoints > 0 ? earnedPoints : order.reward_points_earned || 0;
  const usedPoints = order.lines.reduce(
    (acc, item) => acc + item.mp_reward_spent,
    0,
  );
  const finalUsedPoints =
    order.reward_points_used > 0 ? order.reward_points_used : usedPoints || 0;

  const valueOfDiscount = useMemo(() => {
    let text = null;
    if (order.coupon_id) {
      text = '(Cupón)';
    } else if (order.gift_id) {
      text = ` (Tarjeta Regalo)`;
    } else {
      text = '';
    }

    return ` ${baseDiscountAmount}${text}`;
  }, [order, baseDiscountAmount]);

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h6">Resumen</Typography>
        </Stack>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ID"
            value={order.id.toString()}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ERP ID"
            value={order.manager_order_id || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Número"
            value={order.order_number.toString()}
          />
          {order.shipping_type === 'locker' && (
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Inpost seleccionado"
              value={order.pickup_locker_id || 'Desconocido'}
            />
          )}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Transportista"
          >
            {order.status.id < 4 ? (
              <Stack alignItems="stretch" direction="column" spacing={1}>
                <TextField
                  fullWidth
                  hiddenLabel
                  margin="normal"
                  name="shipping_provider"
                  size="small"
                  onChange={handleShippingProviderChange}
                  select
                  SelectProps={{ native: true }}
                  value={shippingProvider?.id}
                  sx={{ mt: 0 }}
                  disabled={!user.role.can_edit}
                >
                  {shippingProviderOptions.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={updateShippingProvider}
                  disabled={updatingShippingProvider || !user.role.can_edit}
                >
                  {updatingShippingProvider
                    ? 'Actualizando transportista…'
                    : 'Actualizar transportista'}
                </Button>
              </Stack>
            ) : (
              shippingProvider?.label || (
                <Typography color="inherit" variant="body2">
                  Desconocido
                </Typography>
              )
            )}
          </PropertyListItem>
          <PropertyListItem align={align} disableGutters divider label="Estado">
            <Stack alignItems="stretch" direction="column" spacing={1}>
              <TextField
                hiddenLabel
                margin="normal"
                name="status"
                size="small"
                onChange={handleStatusChange}
                select
                value={status?.id}
                sx={{ mt: 0 }}
                disabled={!user.edit_order_status || !user.role.can_edit}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <SeverityPill color={option.color} sx={{ py: 0.5 }}>
                      <SvgIcon
                        fontSize="small"
                        color="inherit"
                        sx={{ mr: 0.5 }}
                      >
                        {option.icon}
                      </SvgIcon>{' '}
                      {option.label}
                    </SeverityPill>
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                size="small"
                onClick={updateStatus}
                disabled={
                  updating || !user.edit_order_status || !user.role.can_edit
                }
              >
                {updating ? 'Actualizando estado…' : 'Actualizar estado'}
              </Button>
            </Stack>
          </PropertyListItem>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Fecha de compra"
            value={createdAt}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Tienda"
            value={
              order.store ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">{order.store.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.store.code.toUpperCase()}
                  </Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="caption">
                  N/A
                </Typography>
              )
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Quiere factura"
            value={order.needs_invoice ? 'Sí' : 'No'}
          />
          {order.needs_invoice && (
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="CIF"
              value={order.billing_cif || 'Desconocido'}
            />
          )}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Quiere tiquet regalo"
            value={order.needs_gift_receipt ? 'Sí' : 'No'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Quiere tax free"
            value={order.is_tax_free ? 'Sí' : 'No'}
          />
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Desglose de precios</Typography>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Precio total"
            value={baseAmount}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Gastos de envío"
            value={shippingAmount}
          />
          {/* <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Impuestos"
            value={baseTaxAmount}
          /> */}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Descuento"
            value={valueOfDiscount}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Puntos gastados"
            value={`${finalUsedPoints} punto${
              finalUsedPoints !== 1 ? 's' : ''
            } (${numeral(finalUsedPoints * 0.05).format('$0,0.00')})`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Importe total"
            value={totalAmount}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Puntos obtenidos"
            value={`${finalEarnedPoints} punto${
              finalEarnedPoints !== 1 ? 's' : ''
            }`}
          />
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Información del cliente</Typography>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ERP ID"
            value={getCustomerErpId(order.customer, order.store_id)}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Dirección IP"
            value={`${order.remote_ip}${
              order.x_forwarded_for ? ` (${order.x_forwarded_for})` : ''
            }`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Nombre"
            value={
              order.customer?.name ? (
                <Link
                  component={NextLink}
                  href={`/customers/${order.customer.id}`}
                  variant="body2"
                >
                  {`${order.customer.name?.trim() || ''} ${
                    order.customer.last_name?.trim() || ''
                  }`}
                </Link>
              ) : order.customer_firstname ? (
                `${order.customer_firstname} ${order.customer_lastname}`
              ) : (
                'Desconocido'
              )
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Correo electrónico"
            value={
              order.customer?.email || order.customer_email || 'Desconocido'
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Teléfono"
            value={order.customer?.phone || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Grupo"
            value={order.customer?.group?.name || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Fecha de registro"
            value={format(new Date(order.customer.created_at), 'd MMMM, yyyy', {
              locale: es,
            })}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Puntos"
            value={order.customer.reward_points || 0}
          />
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Dirección de facturación</Typography>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Nombre"
            value={
              order.billing_name
                ? `${order.billing_name?.trim() || ''} ${
                    order.billing_last_name?.trim() || ''
                  }`
                : 'Desconocido'
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Dirección"
            value={order.billing_address?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Código postal"
            value={order.billing_cp?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Ciudad"
            value={order.billing_locality?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Provincia"
            value={order.billing_region?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="País"
            value={
              order.billing_country?.trim() === 'M1'
                ? 'Madeira/Azores'
                : order.billing_country?.trim() || 'Desconocido'
            }
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Teléfono"
            value={order.billing_phone?.trim() || 'Desconocido'}
          />
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Dirección de envío</Typography>
        <PropertyList>
          {order.shipping_type === 'locker' && (
            <PropertyListItem
              align={align}
              divider
              disableGutters
              label="Número de Locker"
              value={order.pickup_locker_id || 'Desconocido'}
            />
          )}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label={order.shipping_type === 'pickup' ? 'Tienda' : 'Nombre'}
            value={
              order.shipping_name
                ? `${order.shipping_name?.trim() || ''} ${
                    order.shipping_last_name?.trim() || ''
                  }`
                : 'Desconocido'
            }
          />
          {order.shipping_type === 'pickup' && (
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Contacto recogida"
              value={order.shipping_contact_name?.trim() || 'Desconocido'}
            />
          )}
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Dirección"
            value={order.shipping_address?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Código postal"
            value={order.shipping_cp?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Ciudad"
            value={order.shipping_locality?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Provincia"
            value={order.shipping_region?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="País"
            value={order.shipping_country?.trim() || 'Desconocido'}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Teléfono"
            value={order.shipping_phone?.trim() || 'Desconocido'}
          />
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Informacíon del pago</Typography>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Método de pago"
            value={order.payment?.method?.name || 'Desconocido'}
          />
          {order.payment && (
            <>
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Merchant reference"
                value={order.payment.transaction_id || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Adyen PSP Reference"
              >
                {pspReferencePayment ? (
                  <Link
                    variant="body2"
                    href={`https://ca-live.adyen.com/ca/ca/accounts/showTx.shtml?pspReference=${pspReferencePayment}&txType=Payment`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pspReferencePayment}
                  </Link>
                ) : (
                  <Typography color="inherit" variant="body2">
                    Desconocido
                  </Typography>
                )}
              </PropertyListItem>
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Tipo de pago"
                value={order.payment?.method?.code || 'Desconocido'}
              />
              {[1, 10, 13].includes(order.payment_method_id) && (
                <PropertyListItem
                  align={align}
                  disableGutters
                  divider
                  label="Tarjeta de crédito"
                  value={
                    order.payment.adyen_webhook_log
                      ? `xxxx-xxxx-xxxx-${
                          JSON.parse(order.payment.adyen_webhook_log)
                            ?.notificationItems?.[0]?.NotificationRequestItem
                            .additionalData.cardSummary
                        }`
                      : 'Desconocido'
                  }
                />
              )}
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Código de autorización"
                value={
                  JSON.parse(order.payment.adyen_webhook_log)
                    ?.notificationItems?.[0]?.NotificationRequestItem
                    .additionalData.authCode || 'Desconocido'
                }
              />
            </>
          )}
        </PropertyList>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h6">Productos</Typography>
        <Scrollbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Precio original</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell align="center">Unidades</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell align="right">Importe total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const itemOriginalPrice = numeral(
                  item.base_original_price_incl_tax,
                ).format(`$0,0.00`);
                const itemPrice = numeral(item.base_price_incl_tax).format(
                  `$0,0.00`,
                );
                const itemSubtotal = numeral(
                  item.base_original_price_incl_tax * item.qty_ordered,
                ).format(`$0,0.00`);
                const itemTax = numeral(item.tax_amount).format(`$0,0.00`);
                const itemDiscount = numeral(item.discount_amount).format(
                  `$0,0.00`,
                );
                const itemTotal = numeral(item.row_total_incl_tax).format(
                  `$0,0.00`,
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
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
                          height: 60,
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: 60,
                          boxSizing: 'content-box',
                          // marginLeft: '-8px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Link
                          variant="caption"
                          component={NextLink}
                          href={`/products/${item.product_id}`}
                        >
                          {item.product.name?.value}
                        </Link>
                        <Typography color="text.secondary" variant="caption">
                          SKU. {item.product.sku}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          REF. {item.product.reference}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{itemOriginalPrice}</TableCell>
                    <TableCell>{itemPrice}</TableCell>
                    <TableCell align="center">{item.qty_ordered}</TableCell>
                    <TableCell>{itemSubtotal}</TableCell>
                    <TableCell>
                      <Tooltip placement="top" title={`${item.tax_percent}%`}>
                        <span>{itemTax}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{itemDiscount}</TableCell>
                    <TableCell align="right">{itemTotal}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Stack>
    </Stack>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.object,
  onClose: PropTypes.func,
};
