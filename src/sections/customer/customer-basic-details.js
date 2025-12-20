import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CustomerBasicDetails = (props) => {
  const { customer, ...other } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const align = lgUp ? 'horizontal' : 'vertical';

  return (
    <Card {...other}>
      <CardHeader title="Información básica" />
      <PropertyList>
        <PropertyListItem
          align={align}
          divider
          label="ERP ID"
          value={customer.customer_erp_id || 'Desconocido'}
        />
        <PropertyListItem
          align={align}
          divider
          label="Nombre completo"
          value={`${customer.name} ${customer.last_name}`}
        />
        <PropertyListItem
          align={align}
          divider
          label="Email"
          value={customer.email || 'Desconocido'}
        />
        <PropertyListItem
          align={align}
          divider
          label="Verificado"
          value={!!customer.email_verified_at ? 'Sí' : 'No'}
        />
        <PropertyListItem
          align={align}
          divider
          label="Grupo"
          value={customer.is_guest === 1 ? 'Invitado' : customer.group.name}
        />
        <PropertyListItem
          align={align}
          divider
          label="Puntos"
          value={customer.reward_points || 0}
        />
        <PropertyListItem
          align={align}
          divider
          label="Teléfono"
          value={customer.phone || 'Desconocido'}
        />
        {customer.addresses.map((item, index) => (
          <PropertyListItem
            key={item.id}
            align={align}
            divider
            label={`Dirección ${index + 1}`}
            value={
              <>
                <Typography variant="body2">
                  {item.address.replace(/,/g, '').trim()},
                </Typography>
                <Typography variant="body2">
                  {[
                    item.locality.replace(/,/g, '').trim(),
                    item.region.replace(/,/g, '').trim(),
                    item.cp.replace(/,/g, '').trim(),
                    item.country.replace(/,/g, '').trim(),
                  ].join(', ')}
                </Typography>
                {item.phone && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Tel: {item.phone.replace(/,/g, '').trim()}
                  </Typography>
                )}
              </>
            }
          />
        ))}
        <PropertyListItem
          align={align}
          divider
          label="Cumpleaños"
          value={
            customer.birth_date
              ? format(new Date(customer.birth_date), 'P', { locale: es })
              : 'Desconocido'
          }
        />
        <PropertyListItem
          align={align}
          divider
          label="Fecha de registro"
          value={
            customer.created_at
              ? format(new Date(customer.created_at), 'P', { locale: es })
              : 'Desconocido'
          }
        />
      </PropertyList>
    </Card>
  );
};

CustomerBasicDetails.propTypes = {
  customer: PropTypes.object.isRequired,
};
