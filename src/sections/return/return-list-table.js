import { useCallback } from 'react';
import NextLink from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { MessageChatSquare, Package } from '@untitled-ui/icons-react';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(9, '0');
};

const messageFrom = {
  auto: 'Automática',
  manager: 'Administrador',
  customer: 'Cliente',
};

const returnStatus = {
  approved: 'Aprobado',
  canceled: 'Cancelado',
  closed: 'Cerrado',
  issue_refund: 'Reembolso emitido',
  package_received: 'Paquete recibido',
  package_sent: 'Paquete enviado',
  pending_approval: 'Pendiente de aprobación',
};

const returnStatusColor = {
  approved: 'success',
  canceled: 'error',
  closed: 'success',
  issue_refund: 'success',
  package_received: 'success',
  package_sent: 'success',
  pending_approval: 'warning',
};

export const ReturnListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  returns,
  returnsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(returns);

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

  const selectedAll = selected.length === returns.length;
  const selectedSome = selected.length > 0 && selected.length < returns.length;

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
              <TableCell>Solicitud</TableCell>
              <TableCell>Pedido</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Última respuesta</TableCell>
              <TableCell>Resolución</TableCell>
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
                  {Array.from(Array(10)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 2 && (
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
              returns.map((returnItem) => {
                const lastMessage = returnItem.messages.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at),
                )[0];
                const store =
                  returnItem.order.store_name === 'es' ||
                  returnItem.order.store_name === 'España'
                    ? 'España'
                    : returnItem.order.store_name === 'pt' ||
                      returnItem.order.store_name === 'Portugal'
                    ? 'Portugal'
                    : returnItem.order.store_name;
                return (
                  <TableRow key={returnItem.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(returnItem.id)}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(returnItem.id);
                          } else {
                            deselectOne(returnItem.id);
                          }
                        }}
                        value={selected.includes(returnItem.id)}
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
                          href={`/returns/${returnItem.id}`}
                        >
                          {fillWithZeros(returnItem.id)}
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <SvgIcon color="action" fontSize="small">
                          <Package />
                        </SvgIcon>
                        <Link
                          color="primary"
                          component={NextLink}
                          href={`/orders/${returnItem.order.id}`}
                        >
                          {returnItem.order.order_number}
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Link
                          color="inherit"
                          component={NextLink}
                          href={`/customers/${returnItem.customer.id}`}
                          variant="subtitle2"
                        >
                          {returnItem.customer.name}{' '}
                          {returnItem.customer.last_name}
                        </Link>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: '0 !important' }}
                        >
                          {returnItem.customer.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {returnItem.lines.length === 0 && (
                        <Typography color="text.secondary" variant="caption">
                          Ninguno
                        </Typography>
                      )}
                      {returnItem.lines.length > 0 && (
                        <AvatarGroup
                          max={3}
                          spacing="small"
                          total={returnItem.lines.length}
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
                          {returnItem.lines.slice(0, 3).map((item) => {
                            const { product } = item.order_line;
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
                    <TableCell>
                      {lastMessage ? (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <Tooltip
                            arrow
                            placement="top"
                            title={lastMessage.message}
                          >
                            <SvgIcon color="action" fontSize="small">
                              <MessageChatSquare />
                            </SvgIcon>
                          </Tooltip>
                          <Typography color="text.secondary" variant="caption">
                            {messageFrom[lastMessage.from]}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          Ninguna
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        <SeverityPill
                          color={returnStatusColor[returnItem.status]}
                        >
                          {returnStatus[returnItem.status]}
                        </SeverityPill>
                      }
                    </TableCell>
                    <TableCell>{store}</TableCell>
                    <TableCell>
                      {format(
                        new Date(returnItem.updated_at),
                        'dd/MM/yyyy HH:mm',
                        { locale: es },
                      )}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(returnItem.created_at),
                        'dd/MM/yyyy HH:mm',
                        { locale: es },
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/returns/${returnItem.id}`}
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
        count={returnsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Solicitudes por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};
