import { useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { ProcessesListLine } from './processes-list-line';

export const ProcessesListTable = (props) => {
  const { processes, loading } = props;
  const updateLine = (processId, process) => {
    const index = processes.findIndex((process) => process.id === processId);
    if (index !== -1) {
      processes[index] = process;
    }
  };
  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Código</TableCell>
              <TableCell align="center">Descripción</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Última ejecución</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(5)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell width="1px" align="center">
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={50}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  {Array.from(Array(5)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 0 && (
                        <Skeleton
                          variant="text"
                          width={100}
                          sx={{
                            marginTop: 1,
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              processes.map((process) => {
                return (
                  <ProcessesListLine
                    process={process}
                    key={Math.random()}
                    updateLine={updateLine}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

ProcessesListTable.propTypes = {
  processes: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};
