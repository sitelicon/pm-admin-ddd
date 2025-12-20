import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  AvatarGroup,
  Box,
  Checkbox,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { format } from 'date-fns';
import { SeverityPill } from '../../components/severity-pill';
import {
  AnnotationQuestion,
  MessageChatSquare,
  MessageDotsSquare,
  MessageSquare01,
  Package,
} from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(5, '0');
};

export const CartListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  carts,
  cartsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(carts);

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

  const selectedAll = selected.length === carts.length;
  const selectedSome = selected.length > 0 && selected.length < carts.length;

  return (
    <div {...other}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Última Actualización</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  {Array.from(Array(8)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 1 && (
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
              carts.map((cart) => {
                return (
                  <TableRow key={cart.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(cart.id)}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(cart.id);
                          } else {
                            deselectOne(cart.id);
                          }
                        }}
                        value={selected.includes(cart.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          #
                        </Typography>
                        <Link
                          color="primary"
                          component={NextLink}
                          href={`/carts/${cart.id}`}
                        >
                          {fillWithZeros(cart.id)}
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {cart.customer.name ? (
                        <Stack spacing={1}>
                          <Link
                            color="inherit"
                            component={NextLink}
                            href={`/customers/${cart.customer.id}`}
                            variant="subtitle2"
                          >
                            {cart.customer.name} {cart.customer.last_name}
                          </Link>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: '0 !important' }}
                          >
                            {cart.customer.email}
                          </Typography>
                        </Stack>
                      ) : (
                        <Link
                          color="text.secondary"
                          component={NextLink}
                          href={`/customers/${cart.customer.id}`}
                          variant="caption"
                        >
                          Cliente invitado
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{cart.customer.group.name}</TableCell>
                    <TableCell>
                      {cart.lines.length === 0 && (
                        <Typography color="text.secondary" variant="caption">
                          Ninguno
                        </Typography>
                      )}
                      {cart.lines.length > 0 && (
                        <AvatarGroup
                          max={3}
                          spacing="small"
                          total={cart.lines.length}
                          variant="rounded"
                          component={({ children, ...rest }) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'start',
                              }}
                              {...rest}
                            >
                              {children}
                            </Box>
                          )}
                        >
                          {cart.lines.slice(0, 3).map((item) => {
                            const { product } = item;
                            const image =
                              product.images.find(
                                ({ tag }) => tag === 'PRINCIPAL',
                              )?.url ||
                              product.images[0]?.url ||
                              '';
                            return (
                              <Box
                                key={item.id}
                                sx={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Tooltip
                                  arrow
                                  title={
                                    product.name?.value ||
                                    'Producto descatalogado'
                                  }
                                  placement="top"
                                >
                                  <Box
                                    key={item.id}
                                    sx={{
                                      alignItems: 'center',
                                      backgroundColor: 'neutral.50',
                                      backgroundImage: `url(${image})`,
                                      backgroundPosition: 'center',
                                      backgroundSize: 'cover',
                                      borderRadius: 1,
                                      display: 'flex',
                                      height: 40,
                                      justifyContent: 'center',
                                      overflow: 'hidden',
                                      width: 40,
                                      border: '2px solid #fff',
                                      boxSizing: 'content-box',
                                      // marginLeft: '-8px',
                                    }}
                                  />
                                </Tooltip>
                              </Box>
                            );
                          })}
                        </AvatarGroup>
                      )}
                    </TableCell>
                    <TableCell>{cart.store.name}</TableCell>
                    <TableCell>
                      {format(new Date(cart.updated_at), 'dd/MM/yyyy HH:mm', {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(cart.created_at), 'dd/MM/yyyy HH:mm', {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/carts/${cart.id}`}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Editar
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={cartsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Elementos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};
