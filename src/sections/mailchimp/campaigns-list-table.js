import PropTypes from 'prop-types';
import { Telescope } from '@untitled-ui/icons-react';

import {
  Box,
  Checkbox,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { CampaignsListItemTable } from './campaigns-item-table';

export const CampaignsListTable = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    page,
    campaigns,
    campaignsCount,
    perPage,
    loading,
    columns,
    ...other
  } = props;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="1px" align="center">
                # ID
              </TableCell>
              <TableCell>Audiencia</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Emails Enviados</TableCell>
              <TableCell>Tasa apertura</TableCell>
              <TableCell>Tasa clicks</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell>Estatus</TableCell>
              <TableCell>Acciones</TableCell>
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
                  {Array.from(Array(columns.length)).map((_, index) => (
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
            {!loading && campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 3} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Telescope />
                    </SvgIcon>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron campañas que coincidan con los filtros
                      aplicados.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              campaigns.map((campaign) => {
                return (
                  <CampaignsListItemTable
                    key={campaign.id}
                    campaign={campaign}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={campaignsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Campañas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  );
};

CampaignsListTable.propTypes = {
  campaigns: PropTypes.array.isRequired,
  campaignsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};
