import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import TableRowExpand from './table-row-expand';

export const OrderExpeditions = ({ order, ...other }) => {
  return (
    <Card {...other}>
      <CardHeader title="Expediciones" />
      <CardContent sx={{ pt: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Paquetes</TableCell>
              <TableCell>Incidencia</TableCell>
              <TableCell>Fecha entrega</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell>Fecha actualización</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.expeditions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay expediciones para este pedido
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {order.expeditions.map((expedition) => (
              <TableRowExpand key={expedition.id} expedition={expedition} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

OrderExpeditions.propTypes = {
  order: PropTypes.object.isRequired,
};
