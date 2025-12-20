import { useState } from 'react';
import {
  Box,
  Collapse,
  SvgIcon,
  Table,
  TableBody,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { SeverityPill } from '../../components/severity-pill';
import { Clock, PackageCheck } from '@untitled-ui/icons-react';

export default function TableRowExpand({ expedition }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{expedition.expedition_number}</TableCell>
        <TableCell>
          <SeverityPill
            color={expedition.state === 'ENTREGADO' ? 'success' : 'info'}
          >
            <SvgIcon fontSize="small" color="inherit" sx={{ mr: 0.5 }}>
              {expedition.state === 'ENTREGADO' ? <PackageCheck /> : <Clock />}
            </SvgIcon>
            {expedition.state}
          </SeverityPill>
        </TableCell>
        <TableCell align="center">
          {parseInt(expedition.packages, 10)}
        </TableCell>
        <TableCell>
          {expedition.incidence === 'SIN INCIDENCIA' ? (
            <Typography
              color="text.secondary"
              variant="caption"
              fontStyle="italic"
            >
              {expedition.incidence}
            </Typography>
          ) : (
            <Typography color="error" variant="caption">
              {expedition.incidence}
            </Typography>
          )}
        </TableCell>
        <TableCell>
          {format(new Date(expedition.delivered_at), 'dd/MM/yyyy HH:mm', {
            locale: es,
          })}
        </TableCell>
        <TableCell>
          {format(new Date(expedition.created_at), 'dd/MM/yyyy HH:mm', {
            locale: es,
          })}
        </TableCell>
        <TableCell>
          {format(new Date(expedition.updated_at), 'dd/MM/yyyy HH:mm', {
            locale: es,
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0 }} colSpan={10}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{
              width: '100%',
            }}
          >
            <Box sx={{ margin: 1 }} textAlign={'center'} width={'100%'}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Evento</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Tipo</TableCell>
                    <TableCell align="right">Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expedition.logs.map((log) => (
                    <TableRow key={log.date}>
                      <TableCell component="th" scope="row">
                        {log.event}
                      </TableCell>
                      <TableCell>{log.name}</TableCell>
                      <TableCell align="right">{log.type}</TableCell>
                      <TableCell align="right">
                        {format(new Date(log.updated_at), 'dd/MM/yyyy HH:mm', {
                          locale: es,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
