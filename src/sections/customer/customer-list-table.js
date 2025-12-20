import { useCallback } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Scrollbar } from '../../components/scrollbar';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

function TablePaginationActionsWrapper(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const { hasNextPage, hasPrevPage } = props;

  return (
    <TablePaginationActions
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
    />
  );
}

export const CustomerListTable = (props) => {
  const {
    loading,
    customers,
    hasNextPage,
    hasPrevPage,
    onPageChange,
    onPerPageChange,
    page,
    perPage,
    ...other
  } = props;
  const { deselectAll, selectAll, deselectOne, selectOne, selected } =
    useSelectionModel(customers);

  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const selectedAll = selected.length === customers.length;
  const selectedSome =
    selected.length > 0 && selected.length < customers.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button color="error" size="small">
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>ERP ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell align="center">Correo confirmado</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align="center">Puntos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox" />
                  {Array.from(new Array(9)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && customers.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                    sx={{ p: 4 }}
                  >
                    No hay clientes que coincidan con los criterios de búsqueda
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              customers.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const isDeleted = customer.deleted_at ? true : false;
                if (isDeleted) {
                  return (
                    <TableRow hover key={customer.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            const { checked } = event.target;

                            if (checked) {
                              selectOne(customer.id);
                            } else {
                              deselectOne(customer.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {customer.customer_erp_id || (
                          <Typography color="text.secondary" variant="body2">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Link
                            color="primary"
                            component={NextLink}
                            href={`/customers/${customer.id}`}
                            variant="caption"
                          >
                            {customer.name.trim().toUpperCase()}{' '}
                            {customer.last_name.trim().toUpperCase()}
                          </Link>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            noWrap
                          >
                            {customer.email}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" colSpan={6}>
                        <Typography
                          color="error"
                          variant="body2"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Cliente Eliminado
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={NextLink}
                          href={`/customers/${customer.id}`}
                        >
                          <SvgIcon>
                            <ArrowRightIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(customer.id);
                          } else {
                            deselectOne(customer.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      {customer.customer_erp_id || (
                        <Typography color="text.secondary" variant="body2">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Link
                          color="primary"
                          component={NextLink}
                          href={`/customers/${customer.id}`}
                          variant="caption"
                        >
                          {customer.name.trim().toUpperCase()}{' '}
                          {customer.last_name.trim().toUpperCase()}
                        </Link>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                          noWrap
                        >
                          {customer.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.is_guest === 1
                        ? 'Invitado'
                        : customer.group.name}
                    </TableCell>
                    <TableCell>
                      {customer.store ? (
                        `${
                          customer.store.name
                        } (${customer.store.code.toUpperCase()})`
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          Desconocida
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(customer.created_at),
                        'dd/MM/yyyy HH:mm:ss',
                        { locale: es },
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        color={
                          customer.email_verified_at ? 'green' : 'warning.main'
                        }
                        variant="body2"
                      >
                        {customer.email_verified_at
                          ? 'Confirmado'
                          : 'Pendiente'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {customer.phone ? (
                        customer.phone.replace(/\s/g, '')
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          Desconocido
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {customer.reward_points || 0}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={NextLink}
                        href={`/customers/${customer.id}`}
                      >
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={-1}
        page={page}
        rowsPerPage={perPage}
        onRowsPerPageChange={onPerPageChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Clientes por página"
        ActionsComponent={(p) => (
          <TablePaginationActionsWrapper
            {...p}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        )}
      />
    </Box>
  );
};

CustomerListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  hasNextPage: PropTypes.bool.isRequired,
};
