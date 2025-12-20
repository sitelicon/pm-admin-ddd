import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { SeverityPill } from '../../components/severity-pill';
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
} from '@untitled-ui/icons-react';
import { getCustomerErpId } from '../../utils/get-customer-erp-id';

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

export const ShipmentSummary = ({ shipment }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const align = mdUp ? 'horizontal' : 'vertical';

  const status = getStatusLabel(shipment.order.status.code);
  const statusColor = statusMap[shipment.order.status.code] || 'warning';

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Información general" />
            <PropertyList>
              <PropertyListItem
                divider
                align={align}
                label="ID"
                value={shipment.id}
              />
              <PropertyListItem
                divider
                align={align}
                label="Número"
                value={shipment.number}
              />
              <PropertyListItem
                divider
                align={align}
                label="Tienda"
                value={
                  <Stack alignItems="center" direction="row" spacing={0.5}>
                    <Typography variant="inherit">
                      {shipment.store.name}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {shipment.store.code.toUpperCase()}
                    </Typography>
                  </Stack>
                }
              />
              <PropertyListItem
                divider
                align={align}
                label="Última actualización"
                value={format(
                  new Date(shipment.updated_at),
                  'dd/MM/yyyy HH:mm',
                  { locale: es },
                )}
              />
              <PropertyListItem divider align={align} label="Pedido">
                <Link
                  color="primary"
                  component={NextLink}
                  href={`/orders/${shipment.order.id}`}
                  variant="body2"
                >
                  {shipment.order.order_number}
                </Link>
              </PropertyListItem>
              <PropertyListItem divider align={align} label="Estado del pedido">
                <SeverityPill color={statusColor} severity={status.label}>
                  <SvgIcon fontSize="small" color="inherit" sx={{ mr: 0.5 }}>
                    {status.icon}
                  </SvgIcon>{' '}
                  {status.label}
                </SeverityPill>
              </PropertyListItem>
              <PropertyListItem divider align={align} label="Datos de envío">
                <Typography variant="subtitle2" color="text.secondary">
                  {shipment.order.shipping_name}{' '}
                  {shipment.order.shipping_last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[
                    shipment.order.shipping_address,
                    shipment.order.shipping_cp,
                    shipment.order.shipping_locality,
                    shipment.order.shipping_region,
                    shipment.order.shipping_country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tel. {shipment.order.shipping_phone}
                </Typography>
              </PropertyListItem>
              {/* <PropertyListItem divider align={align} label="Resolución">
                <TextField
                  select
                  fullWidth
                  label="Resolución"
                  onChange={(e) => setResolution(e.target.value)}
                  SelectProps={{ native: true }}
                  value={resolution}
                  variant="filled"
                >
                  {resolutionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </PropertyListItem> */}
            </PropertyList>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Información del cliente" />
            <PropertyList>
              <PropertyListItem
                divider
                align={align}
                label="ERP ID"
                value={getCustomerErpId(
                  shipment.order.customer,
                  shipment.order.store_id,
                )}
              />
              <PropertyListItem
                align={align}
                divider
                label="Dirección IP"
                value={`${shipment.order.remote_ip}${
                  shipment.order.x_forwarded_for
                    ? ` (${shipment.order.x_forwarded_for})`
                    : ''
                }`}
              />
              <PropertyListItem
                align={align}
                divider
                label="Nombre"
                value={
                  shipment.order.customer?.name ? (
                    <Link
                      component={NextLink}
                      href={`/customers/${shipment.order.customer.id}`}
                      variant="body2"
                    >
                      {`${shipment.order.customer.name?.trim() || ''} ${
                        shipment.order.customer.last_name?.trim() || ''
                      }`}
                    </Link>
                  ) : shipment.order.customer_firstname ? (
                    `${shipment.order.customer_firstname} ${shipment.order.customer_lastname}`
                  ) : (
                    'Desconocido'
                  )
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Correo electrónico"
                value={
                  shipment.order.customer?.email ||
                  shipment.order.customer_email ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Teléfono"
                value={shipment.order.customer?.phone || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Grupo"
                value={shipment.order.customer?.group?.name || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Fecha de registro"
                value={format(
                  new Date(shipment.order.customer.created_at),
                  'd MMMM, yyyy',
                  {
                    locale: es,
                  },
                )}
              />
              <PropertyListItem
                divider
                align={align}
                label="Puntos"
                value={shipment.order.customer.reward_points || 0}
              />
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

ShipmentSummary.propTypes = {
  shipment: PropTypes.object.isRequired,
};
