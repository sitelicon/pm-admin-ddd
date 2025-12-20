import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { SeverityPill } from '../../components/severity-pill';
import { getCustomerErpId } from '../../utils/get-customer-erp-id';

export const CartSummary = ({ cart }) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const align = mdUp ? 'horizontal' : 'vertical';

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
                value={cart.id}
              />
              <PropertyListItem
                divider
                align={align}
                label="Tienda"
                value={cart.store.name}
              />
              <PropertyListItem
                divider
                align={align}
                label="Subtotal"
                value={cart.subtotal}
              />
              <PropertyListItem
                divider
                align={align}
                label="Descuento"
                value={cart.discount}
              />
              <PropertyListItem
                divider
                align={align}
                label="Subtotal con descuento"
                value={cart.subtotal_with_discount}
              />
              <PropertyListItem
                divider
                align={align}
                label="Puntos usados"
                value={cart.reward_points_used}
              />
              <PropertyListItem
                divider
                align={align}
                label="Total"
                value={cart.grand_total}
              />
              <PropertyListItem
                divider
                align={align}
                label="Última actualización"
                value={format(new Date(cart.updated_at), 'dd/MM/yyyy HH:mm', {
                  locale: es,
                })}
              />
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
                value={getCustomerErpId(cart.customer, cart.store_id)}
              />
              <PropertyListItem divider align={align} label="Nombre">
                <Link
                  color="primary"
                  component={NextLink}
                  href={`/customers/${cart.customer.id}`}
                  variant="body2"
                >
                  {cart.customer?.name
                    ? `${cart.customer.name} ${cart.customer.last_name}`
                    : 'Desconocido'}
                </Link>
              </PropertyListItem>
              <PropertyListItem
                divider
                align={align}
                label="Correo electrónico"
                value={cart.customer.email || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Teléfono"
                value={cart.customer.phone || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Grupo"
                value={cart.customer.group?.name || 'Desconocido'}
              />
              <PropertyListItem
                divider
                align={align}
                label="Fecha de registro"
                value={format(
                  new Date(cart.customer.created_at),
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
                value={cart.customer.reward_points || 0}
              />
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

CartSummary.propTypes = {
  cart: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
};
