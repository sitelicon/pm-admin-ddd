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
  Building02,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  MessageChatSquare,
  MessageDotsSquare,
  MessageSquare01,
  Package,
  PackageCheck,
  PackageX,
  ShoppingBag01,
  Truck01,
} from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

const statusMap = {
  pending: 'gray',
  payment_failed: 'error',
  under_packaging: 'warning',
  packaged: 'info',
  customer_shipped: 'info',
  shop_shipped: 'info',
  shop_received: 'info',
  delivered: 'success',
  canceled: 'error',
  refund_request: 'warning',
  refunded: 'success',
  refunded_multibank: 'success',
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', icon: <Clock /> };
    case 'payment_failed':
      return { label: 'Pago fallido', icon: <CreditCardX /> };
    case 'under_packaging':
      return { label: 'En preparación', icon: <ShoppingBag01 /> };
    case 'packaged':
      return { label: 'Preparado', icon: <Package /> };
    case 'customer_shipped':
      return { label: 'Enviado', icon: <Truck01 /> };
    case 'shop_shipped':
      return { label: 'En camino', icon: <Truck01 /> };
    case 'shop_received':
      return { label: 'En tienda', icon: <Building02 /> };
    case 'delivered':
      return { label: 'Entregado', icon: <PackageCheck /> };
    case 'canceled':
      return { label: 'Cancelado', icon: <PackageX /> };
    case 'refund_request':
      return { label: 'Devolución', icon: <FlipBackward /> };
    case 'refunded':
      return { label: 'Abonado', icon: <CreditCardCheck /> };
    case 'refunded_multibank':
      return { label: 'Abonado Multibanco', icon: <CreditCardCheck /> };
    default:
      return status;
  }
};

const columnOptions = [
  {
    label: 'Número',
    value: 'number',
  },
  {
    label: 'Pedido',
    value: 'orderId',
  },
  {
    label: 'Estado',
    value: 'status',
  },
  {
    label: 'Cliente',
    value: 'customer',
  },
  {
    label: 'Tienda',
    value: 'store',
  },
  {
    label: 'Productos',
    value: 'products',
  },
  {
    label: 'Cantidad',
    value: 'quantity',
  },
  {
    label: 'Última actualización',
    value: 'updatedAt',
  },
  {
    label: 'Fecha de creación',
    value: 'createdAt',
  },
  {
    label: 'Acciones',
    value: 'actions',
  },
];

export const ShipmentListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  shipments,
  shipmentsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(shipments);

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

  const selectedAll = selected.length === shipments.length;
  const selectedSome =
    selected.length > 0 && selected.length < shipments.length;

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
              {columns.includes('number') && <TableCell>Número</TableCell>}
              {columns.includes('orderId') && <TableCell>Pedido</TableCell>}
              {columns.includes('status') && <TableCell>Estado</TableCell>}
              {columns.includes('shippingProvider') && (
                <TableCell align="center">Agencia</TableCell>
              )}
              {columns.includes('customer') && <TableCell>Cliente</TableCell>}
              {columns.includes('store') && <TableCell>Tienda</TableCell>}
              {columns.includes('products') && <TableCell>Productos</TableCell>}
              {columns.includes('quantity') && (
                <TableCell align="center">Cantidad</TableCell>
              )}
              {columns.includes('updatedAt') && (
                <TableCell>Última Actualización</TableCell>
              )}
              {columns.includes('createdAt') && (
                <TableCell>Fecha de Creación</TableCell>
              )}
              {columns.includes('actions') && (
                <TableCell align="right">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  {Array.from(Array(11)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 4 && (
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
              shipments.map((shipment) => {
                const status = getStatusLabel(shipment.order.status.code);
                const statusColor =
                  statusMap[shipment.order.status.code] || 'warning';
                return (
                  <TableRow key={shipment.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(shipment.id)}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(shipment.id);
                          } else {
                            deselectOne(shipment.id);
                          }
                        }}
                        value={selected.includes(shipment.id)}
                      />
                    </TableCell>
                    {columns.includes('number') && (
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <Typography variant="body2" color="text.secondary">
                            #
                          </Typography>
                          <Link
                            color="primary"
                            component={NextLink}
                            href={`/shipments/${shipment.id}`}
                          >
                            {shipment.number}
                          </Link>
                        </Stack>
                      </TableCell>
                    )}
                    {columns.includes('orderId') && (
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <SvgIcon color="action" fontSize="small">
                            <Package />
                          </SvgIcon>
                          <Link
                            color="primary"
                            component={NextLink}
                            href={`/orders/${shipment.order.id}`}
                          >
                            {shipment.order.order_number}
                          </Link>
                        </Stack>
                      </TableCell>
                    )}
                    {columns.includes('status') && (
                      <TableCell>
                        <SeverityPill color={statusColor}>
                          <SvgIcon
                            fontSize="small"
                            color="inherit"
                            sx={{ mr: 0.5 }}
                          >
                            {status.icon}
                          </SvgIcon>{' '}
                          {status.label}
                        </SeverityPill>
                      </TableCell>
                    )}
                    {columns.includes('shippingProvider') && (
                      <TableCell align="center">
                        {shipment.order.shipping_provider?.name || (
                          <Typography color="text.secondary" variant="caption">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    {columns.includes('customer') && (
                      <TableCell>
                        <Stack spacing={1}>
                          <Link
                            color="inherit"
                            component={NextLink}
                            href={`/customers/${shipment.order.customer_id}`}
                            variant="subtitle2"
                          >
                            {shipment.order.customer_firstname.trim()}{' '}
                            {shipment.order.customer_lastname.trim()}
                          </Link>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: '0 !important' }}
                          >
                            {shipment.order.customer_email}
                          </Typography>
                        </Stack>
                      </TableCell>
                    )}
                    {columns.includes('store') && (
                      <TableCell>{shipment.order.store_name}</TableCell>
                    )}
                    {columns.includes('products') && (
                      <TableCell>
                        {shipment.shipment_lines.length === 0 && (
                          <Typography color="text.secondary" variant="caption">
                            Desconocido
                          </Typography>
                        )}
                        {shipment.shipment_lines.length > 0 && (
                          <AvatarGroup
                            max={3}
                            spacing="small"
                            total={shipment.shipment_lines.length}
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
                            {shipment.shipment_lines.slice(0, 3).map((item) => {
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
                    )}
                    {columns.includes('quantity') && (
                      <TableCell align="center">{shipment.quantity}</TableCell>
                    )}
                    {columns.includes('updatedAt') && (
                      <TableCell>
                        {format(
                          new Date(shipment.updated_at),
                          'dd/MM/yyyy HH:mm',
                          { locale: es },
                        )}
                      </TableCell>
                    )}
                    {columns.includes('createdAt') && (
                      <TableCell>
                        {format(
                          new Date(shipment.created_at),
                          'dd/MM/yyyy HH:mm',
                          { locale: es },
                        )}
                      </TableCell>
                    )}
                    {columns.includes('actions') && (
                      <TableCell align="right">
                        <Link
                          component={NextLink}
                          href={`/shipments/${shipment.id}`}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          Editar
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={shipmentsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Envíos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};
