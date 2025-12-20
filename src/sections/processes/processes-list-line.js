import { useCallback, useState } from 'react';

import PropTypes from 'prop-types';
import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { SeverityPill } from '../../components/severity-pill';
import { toast } from 'react-hot-toast';
import { processesApi } from '../../api/processes';

export const ProcessesListLine = (props) => {
  const { process, updateLine } = props;

  const [updating, setUpdating] = useState(false);

  const executeProcess = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setUpdating(true);
        await processesApi.executeProcess(process.id).then((response) => {
          updateLine(process.id, response.process);
          toast.success('Proceso lanzado correctamente');
        });
      } catch (error) {
        toast.error('No se ha podido lanzar el proceso');
      } finally {
        setUpdating(false);
      }
    },
    [process.id, updateLine],
  );

  return (
    <TableRow key={process.id} hover>
      <TableCell align="center">
        <Typography color="text.primary" variant="caption">
          {process.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="caption">
          {process.code}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="caption">
          {process.description}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <SeverityPill color={process.status === 1 ? 'success' : 'info'}>
          {process.status === 1 ? 'Habilitado' : 'Deshabilitado'}
        </SeverityPill>
      </TableCell>
      <TableCell align="center">
        <Typography color="text.primary" variant="caption">
          {process.last_execution_at ? process.last_execution_at : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="outlined"
          size="small"
          onClick={executeProcess}
          disabled={updating}
        >
          {updating ? 'Actualizando estado…' : 'Actualizar estado'}
        </Button>
      </TableCell>
    </TableRow>
  );
};

ProcessesListLine.propTypes = {
  process: PropTypes.object.isRequired,
  updateLine: PropTypes.func.isRequired,
};
