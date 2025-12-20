import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
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
  Pencil01,
  ShoppingBag01,
  Truck01,
  XCircle,
} from '@untitled-ui/icons-react';
import numeral from 'numeral';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { SeverityPill } from '../../components/severity-pill';
import { ordersApi } from '../../api/orders';
import { getCustomerErpId } from '../../utils/get-customer-erp-id';
import { OrderBillingEditModal } from './order-modal/order-billing';
import { OrderShippingEditModal } from './order-modal/order-shipping';
import { OrderCustomerEditModal } from './order-modal/order-customer';
import { useAuth } from '../../hooks/use-auth';

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
  {
    id: 10,
    label: 'Solicitud de devolución',
    icon: <FlipBackward />,
    color: 'warning',
  },
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

export const OrderSummary = (props) => {
  const { user } = useAuth();
  const { order, refetch, ...other } = props;
  const [updating, setUpdating] = useState(false);
  const [orderShippingNumber, setOrderShippingNumber] = useState(
    order.shipping_provider_number,
  );
  const [customerEmail, setCustomerEmail] = useState(order.customer_email);
  const [updatingShippingProvider, setUpdatingShippingProvider] =
    useState(false);
  const [updatingShippingProviderNumber, setUpdatingShippingProviderNumber] =
    useState(false);
  const [updatingCustomerEmail, setUpdatingCustomerEmail] = useState(false);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [status, setStatus] = useState(
    statusOptions.find(({ id }) => id === order.status.id),
  );
  const [shippingProvider, setShippingProvider] = useState(
    shippingProviderOptions.find(
      ({ id }) => id === order.shipping_provider?.id,
    ),
  );
  const [openCustomerEdit, setOpenCustomerEdit] = useState(false);
  const [openBillingEdit, setOpenBillingEdit] = useState(false);
  const [openShippingEdit, setOpenShippingEdit] = useState(false);

  const pspReferencePayment = useMemo(() => {
    if (order.payment_authorization) {
      const pspReference = order.payment_authorization.comment.match(
        /pspReference: (.*?) <br \/> paymentMethod:/,
      );
      return pspReference ? pspReference[1] : '';
    }
    return '';
  }, [order.payment_authorization]);

  const handleChange = useCallback((event) => {
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
        toast.success('Estado actualizado');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar el estado:' + error.message);
      } finally {
        setUpdating(false);
      }
    },
    [order, refetch, status],
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

  const updateShippingProviderNumber = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingShippingProviderNumber(true);
        await ordersApi.updateOrderShippingProviderNumber(
          order.id,
          orderShippingNumber,
        );
        toast.success('Número de envío actualizado');
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar el número de envío');
      } finally {
        setUpdatingShippingProviderNumber(false);
      }
    },
    [order, orderShippingNumber],
  );

  const updateCustomerEmailOrder = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdatingCustomerEmail(true);
        await ordersApi.updateOrderCustomerEmail(order.id, customerEmail);
        toast.success(
          'Correo electrónico del pedido actualizado. Puede reenviar los correos de forma manual.',
        );
        setUpdatingCustomerEmail(false);
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar el número de envío');
        setUpdatingCustomerEmail(false);
      }
    },
    [order, customerEmail],
  );

  const align = mdUp ? 'horizontal' : 'vertical';
  const createdAt = format(new Date(order.created_at), 'dd/MM/yyyy HH:mm:ss', {
    locale: es,
  });
  const totalAmount = numeral(order.grand_total || 0).format(`$0,0.00`);
  const baseAmount = numeral(order.base_subtotal_incl_tax || 0).format(
    `$0,0.00`,
  );
  const baseTaxAmount = numeral(order.base_tax_amount || 0).format(`$0,0.00`);
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
  const isEditable = useMemo(() => order?.customer_is_guest || false, [order]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader title="Resumen del pedido" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="ID"
                value={order.id.toString()}
              />
              <PropertyListItem
                align={align}
                divider
                label="ERP ID"
                value={order.manager_order_id || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Número"
                value={order.order_number.toString()}
              />
              <PropertyListItem align={align} divider label="Transportista">
                {order.status.id < 4 ? (
                  <Stack alignItems="center" direction="row" spacing={1}>
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
                      sx={{ m: 0 }}
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
                      variant="text"
                      size="medium"
                      onClick={updateShippingProvider}
                      disabled={updatingShippingProvider || !user.role.can_edit}
                    >
                      {updatingShippingProvider
                        ? 'Actualizando…'
                        : 'Actualizar'}
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
              <PropertyListItem align={align} divider label="Número de envío">
                <Stack alignItems="center" direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    hiddenLabel
                    margin="normal"
                    name="shipping_number"
                    size="small"
                    onChange={(event) =>
                      setOrderShippingNumber(event.target.value)
                    }
                    value={orderShippingNumber}
                    sx={{ m: 0 }}
                    disabled={!user.role.can_edit}
                  >
                    {orderShippingNumber}
                  </TextField>
                  <Button
                    variant="text"
                    size="medium"
                    onClick={updateShippingProviderNumber}
                    disabled={
                      updatingShippingProviderNumber || !user.role.can_edit
                    }
                  >
                    {updatingShippingProviderNumber
                      ? 'Actualizando…'
                      : 'Actualizar'}
                  </Button>
                </Stack>
              </PropertyListItem>
              <PropertyListItem align={align} divider label="Estado">
                <Stack
                  alignItems={{
                    xs: 'stretch',
                    sm: 'center',
                  }}
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  spacing={1}
                >
                  <TextField
                    hiddenLabel
                    size="small"
                    margin="none"
                    name="status"
                    onChange={handleChange}
                    select
                    sx={{
                      flexGrow: 1,
                      minWidth: 150,
                    }}
                    value={status?.id}
                    disabled={!user.edit_order_status}
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
                    size="medium"
                    variant="text"
                    onClick={updateStatus}
                    disabled={updating || !user.edit_order_status}
                  >
                    {updating ? 'Actualizando…' : 'Actualizar'}
                  </Button>
                </Stack>
              </PropertyListItem>
              <PropertyListItem align={align} divider label="Correo del pedido">
                <Stack alignItems="center" direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    hiddenLabel
                    margin="normal"
                    name="customer_email"
                    size="small"
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    value={customerEmail}
                    sx={{ m: 0 }}
                    disabled={!user.role.can_edit}
                  >
                    {customerEmail}
                  </TextField>
                  <Button
                    variant="text"
                    size="medium"
                    onClick={updateCustomerEmailOrder}
                    disabled={updatingCustomerEmail || !user.role.can_edit}
                  >
                    {updatingCustomerEmail ? 'Actualizando…' : 'Actualizar'}
                  </Button>
                </Stack>
              </PropertyListItem>
              <PropertyListItem
                align={align}
                divider
                label="Fecha de compra"
                value={createdAt}
              />
              <PropertyListItem
                align={align}
                divider
                label="Tienda"
                value={
                  order.store ? (
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
                  )
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Quiere factura"
                value={order.needs_invoice ? 'Sí' : 'No'}
              />
              {order.needs_invoice && (
                <PropertyListItem
                  align={align}
                  divider
                  label="CIF"
                  value={order.billing_cif || 'Desconocido'}
                />
              )}
              <PropertyListItem
                align={align}
                divider
                label="Quiere tiquet regalo"
                value={order.needs_gift_receipt ? 'Sí' : 'No'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Quiere tax free"
                value={order.is_tax_free ? 'Sí' : 'No'}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader
              title="Información del cliente"
              action={
                isEditable && (
                  <>
                    <Button
                      variant="text"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <Pencil01 />
                        </SvgIcon>
                      }
                      onClick={() => setOpenCustomerEdit(true)}
                      disabled={!user.role.can_edit}
                    >
                      Editar información
                    </Button>
                    <OrderCustomerEditModal
                      open={openCustomerEdit}
                      onClose={() => setOpenCustomerEdit(false)}
                      onSubmit={() => {
                        refetch();
                        setOpenCustomerEdit(false);
                      }}
                      order={order}
                    />
                  </>
                )
              }
            />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="ERP ID"
                value={getCustomerErpId(order.customer, order.store_id)}
              />
              <PropertyListItem
                align={align}
                divider
                label="Dirección IP"
                value={`${order.remote_ip}${
                  order.x_forwarded_for ? ` (${order.x_forwarded_for})` : ''
                }`}
              />
              <PropertyListItem
                align={align}
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
                divider
                label="Correo electrónico"
                value={order.customer?.email || 'Desconocido'}
              />
              {order.customer?.phone && (
                <PropertyListItem
                  align={align}
                  divider
                  label="Teléfono"
                  value={order.customer.phone}
                />
              )}
              <PropertyListItem
                align={align}
                divider
                label="Grupo"
                value={order.customer?.group?.name || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Fecha de registro"
                value={format(
                  new Date(order.customer.created_at),
                  'd MMMM, yyyy',
                  {
                    locale: es,
                  },
                )}
              />
              <PropertyListItem
                align={align}
                divider
                label="Puntos"
                value={order.customer.reward_points || 0}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader
              title="Dirección de facturación"
              action={
                isEditable && (
                  <>
                    <Button
                      variant="text"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <Pencil01 />
                        </SvgIcon>
                      }
                      onClick={() => setOpenBillingEdit(true)}
                      disabled={!user.role.can_edit}
                    >
                      Editar información
                    </Button>
                    <OrderBillingEditModal
                      open={openBillingEdit}
                      onClose={() => setOpenBillingEdit(false)}
                      onSubmit={() => {
                        refetch();
                        setOpenBillingEdit(false);
                      }}
                      order={order}
                    />
                  </>
                )
              }
            />
            <PropertyList>
              <PropertyListItem
                align={align}
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
                divider
                label="Dirección"
                value={order.billing_address?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Código postal"
                value={order.billing_cp?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Ciudad"
                value={order.billing_locality?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Provincia"
                value={order.billing_region?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
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
                divider
                label="Teléfono"
                value={order.billing_phone?.trim() || 'Desconocido'}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader
              title="Dirección de envío"
              action={
                <>
                  <Button
                    variant="text"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <Pencil01 />
                      </SvgIcon>
                    }
                    onClick={() => setOpenShippingEdit(true)}
                    disabled={!user.role.can_edit}
                  >
                    Editar información
                  </Button>
                  <OrderShippingEditModal
                    open={openShippingEdit}
                    onClose={() => setOpenShippingEdit(false)}
                    onSubmit={() => {
                      refetch();
                      setOpenShippingEdit(false);
                    }}
                    order={order}
                  />
                </>
              }
            />
            <PropertyList>
              <PropertyListItem
                align={align}
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
                  divider
                  label="Contacto recogida"
                  value={order.shipping_contact_name?.trim() || 'Desconocido'}
                />
              )}
              {order.shipping_type === 'locker' && (
                <PropertyListItem
                  align={align}
                  divider
                  label="Número de Locker"
                  value={order.pickup_locker_id || 'Desconocido'}
                />
              )}
              <PropertyListItem
                align={align}
                divider
                label="Dirección"
                value={order.shipping_address?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Código postal"
                value={order.shipping_cp?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Ciudad"
                value={order.shipping_locality?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Provincia"
                value={order.shipping_region?.trim() || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="País"
                value={
                  order.shipping_country?.trim() === 'M1'
                    ? 'Madeira/Azores'
                    : order.shipping_country?.trim() || 'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Teléfono"
                value={order.shipping_phone?.trim() || 'Desconocido'}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader title="Desglose de precios" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Precio total"
                value={baseAmount}
              />
              <PropertyListItem
                align={align}
                divider
                label="Gastos de envío"
                value={shippingAmount}
              />
              <PropertyListItem
                align={align}
                divider
                label="Descuento"
                value={`${baseDiscountAmount}${
                  order.promotion?.coupon_code
                    ? ` (${order.promotion.coupon_code})`
                    : '' + order.gift_id
                    ? ` (Tarjeta Regalo)`
                    : '(Cupón)'
                }`}
              />
              <PropertyListItem
                align={align}
                divider
                label="Puntos gastados"
                value={`${finalUsedPoints} punto${
                  finalUsedPoints !== 1 ? 's' : ''
                } (${numeral(finalUsedPoints * 0.05).format('$0,0.00')})`}
              />
              <PropertyListItem
                align={align}
                divider
                label="Importe total"
                value={totalAmount}
              />
              <PropertyListItem
                align={align}
                divider
                label="Puntos obtenidos"
                value={`${finalEarnedPoints} punto${
                  finalEarnedPoints !== 1 ? 's' : ''
                }`}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card {...other}>
            <CardHeader title="Información del pago" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Método de pago"
                value={order.payment?.method?.name || 'Desconocido'}
              />
              {order.payment && (
                <>
                  <PropertyListItem
                    align={align}
                    divider
                    label="Merchant reference"
                    value={order.payment.transaction_id || 'Desconocido'}
                  />
                  <PropertyListItem
                    align={align}
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
                    divider
                    label="Tipo de pago"
                    value={order.payment?.method?.code || 'Desconocido'}
                  />
                  {[1, 10, 13].includes(order.payment_method_id) && (
                    <PropertyListItem
                      align={align}
                      divider
                      label="Tarjeta de crédito"
                      value={
                        order.payment.adyen_webhook_log
                          ? `xxxx-xxxx-xxxx-${
                              JSON.parse(order.payment.adyen_webhook_log)
                                ?.notificationItems?.[0]
                                ?.NotificationRequestItem.additionalData
                                .cardSummary
                            }`
                          : 'Desconocido'
                      }
                    />
                  )}
                  <PropertyListItem
                    align={align}
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

OrderSummary.propTypes = {
  order: PropTypes.object.isRequired,
};
