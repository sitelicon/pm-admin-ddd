import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SvgIcon } from '@mui/material';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Link,
  TextField,
  useMediaQuery,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import {
  Clock,
  Package,
  PackageCheck,
  PackageX,
  Truck01,
  XCircle,
} from '@untitled-ui/icons-react';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { SeverityPill } from '../../components/severity-pill';
import { getCustomerErpId } from '../../utils/get-customer-erp-id';
import { returnsApi } from '../../api/returns';
import toast from 'react-hot-toast';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(9, '0');
};

const statusOptions = [
  {
    status: 'pending_approval',
    label: 'Pendiente de aprobación',
    icon: <Clock />,
    color: 'warning',
  },
  { status: 'canceled', label: 'Cancelado', icon: <XCircle />, color: 'error' },
  {
    status: 'issue_refund',
    label: 'Reembolso emitido',
    icon: <Package />,
    color: 'info',
  },
  {
    status: 'package_received',
    label: 'Paquete recibido',
    icon: <Truck01 />,
    color: 'info',
  },
  {
    status: 'package_sent',
    label: 'Paquete enviado',
    icon: <Truck01 />,
    color: 'info',
  },
  {
    status: 'approved',
    label: 'Aprobado',
    icon: <PackageCheck />,
    color: 'success',
  },
  { status: 'closed', label: 'Cerrado', icon: <PackageX />, color: 'error' },
];

const packageStatus = {
  opened: 'Abierto',
  not_opened: 'Sin abrir',
  damaged: 'Dañado',
};

const packageStatusColor = {
  opened: 'warning',
  not_opened: 'success',
  damaged: 'error',
};

const resolutionOptions = [
  {
    label: 'Devolver',
    value: 'refund',
  },
  {
    label: 'Cambiar',
    value: 'replace',
  },
];

export const ReturnSummary = ({ orderReturn }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [resolution, setResolution] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(orderReturn.status);

  const align = mdUp ? 'horizontal' : 'vertical';

  useEffect(() => {
    if (orderReturn?.reason) {
      setResolution(orderReturn.reason);
    }
  }, [orderReturn.reason]);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const updateStatus = async () => {
    try {
      setUpdating(true);
      const response = await returnsApi.updateStatusReturn(orderReturn.id, {
        status,
      });
      toast.success('Estado actualizado');
      setUpdating(false);
    } catch (err) {
      console.error(err);
      setUpdating(false);
    }
  };

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
                label="Solicitud"
                value={fillWithZeros(orderReturn.id)}
              />
              <PropertyListItem
                divider
                align={align}
                label="Tienda"
                value={orderReturn.order.store_name}
              />
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
                    value={status}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.status} value={option.status}>
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
                    disabled={updating}
                  >
                    {updating ? 'Actualizando…' : 'Actualizar'}
                  </Button>
                </Stack>
              </PropertyListItem>
              <PropertyListItem
                divider
                align={align}
                label="Última actualización"
                value={format(
                  new Date(orderReturn.updated_at),
                  'dd/MM/yyyy HH:mm',
                  { locale: es },
                )}
              />
              <PropertyListItem divider align={align} label="Pedido">
                <Link
                  color="primary"
                  component={NextLink}
                  href={`/orders/${orderReturn.order.id}`}
                  variant="body2"
                >
                  {orderReturn.order.order_number}
                </Link>
              </PropertyListItem>
              <PropertyListItem divider align={align} label="Resolución">
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
              </PropertyListItem>
              <PropertyListItem
                divider
                align={align}
                label="Estado del paquete"
              >
                <SeverityPill
                  color={packageStatusColor[orderReturn.package_status]}
                >
                  {packageStatus[orderReturn.package_status]}
                </SeverityPill>
              </PropertyListItem>
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
                  orderReturn.customer,
                  orderReturn.order.store_id,
                )}
              />
              <PropertyListItem
                align={align}
                divider
                label="Dirección IP"
                value={`${orderReturn.order.remote_ip}${
                  orderReturn.order.x_forwarded_for
                    ? ` (${orderReturn.order.x_forwarded_for})`
                    : ''
                }`}
              />
              <PropertyListItem
                align={align}
                divider
                label="Nombre"
                value={
                  orderReturn.customer?.name ? (
                    <Link
                      component={NextLink}
                      href={`/customers/${orderReturn.customer.id}`}
                      variant="body2"
                    >
                      {`${orderReturn.customer.name?.trim() || ''} ${
                        orderReturn.customer.last_name?.trim() || ''
                      }`}
                    </Link>
                  ) : orderReturn.order.customer_firstname ? (
                    `${orderReturn.order.customer_firstname} ${orderReturn.order.customer_lastname}`
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
                  orderReturn.customer?.email ||
                  orderReturn.order.customer_email ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Teléfono"
                value={orderReturn.customer?.phone || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Grupo"
                value={
                  orderReturn.customer?.customer_group?.name || 'Desconocido'
                }
              />
              <PropertyListItem
                divider
                align={align}
                label="Fecha de registro"
                value={format(
                  new Date(orderReturn.customer.created_at),
                  'd MMMM, yyyy',
                  { locale: es },
                )}
              />
              <PropertyListItem
                divider
                align={align}
                label="Puntos"
                value={orderReturn.customer.reward_points || 0}
              />
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

ReturnSummary.propTypes = {
  orderReturn: PropTypes.object.isRequired,
};
