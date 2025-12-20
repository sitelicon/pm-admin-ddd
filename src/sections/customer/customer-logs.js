import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';

export const CustomerLogs = (props) => {
  const { logs = [], ...other } = props;

  return (
    <Card {...other}>
      <CardHeader action={<MoreMenu />} title="Logs recientes" />
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Método</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ruta</TableCell>
              <TableCell>Evento</TableCell>
              <TableCell>Ip</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => {
              const statusColor =
                log.status >= 200 && log.status < 300 ? 'success' : 'error';
              const createdAt = format(log.createdAt, 'yyyy/MM/dd HH:mm:ss', {
                locale: es,
              });

              return (
                <TableRow key={log.id}>
                  <TableCell width="100">
                    <Typography color="text.secondary" variant="caption">
                      {log.method}
                    </Typography>
                  </TableCell>
                  <TableCell width="64">
                    <SeverityPill color={statusColor}>
                      {log.status}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{log.route}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{createdAt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={logs.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={0}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Card>
  );
};

CustomerLogs.propTypes = {
  logs: PropTypes.array,
};
