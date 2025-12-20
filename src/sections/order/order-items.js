import PropTypes from 'prop-types';
import numeral from 'numeral';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardHeader,
  Link,
  Stack,
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
import { TablePaginationActions } from '../../components/table-pagination-actions';

export const OrderItems = (props) => {
  const { order, ...other } = props;

  const usedPoints = order.lines.reduce(
    (acc, item) => acc + item.mp_reward_spent,
    0,
  );
  const finalUsedPoints =
    order.reward_points_used > 0 ? order.reward_points_used : usedPoints || 0;

  return (
    <Card {...other}>
      <CardHeader title="Líneas del pedido" />
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Precio original</TableCell>
                <TableCell align="center">Descuento</TableCell>
                <TableCell align="center">Precio</TableCell>
                <TableCell align="center">Unidades</TableCell>
                <TableCell align="center">Subtotal</TableCell>
                <TableCell align="center">Impuestos</TableCell>
                <TableCell align="center">Importe total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.lines?.map((item) => {
                const itemOriginalPrice = numeral(
                  item.base_original_price_incl_tax,
                ).format(`$0,0.00`);
                const itemPrice = numeral(item.base_price_incl_tax).format(
                  `$0,0.00`,
                );
                const itemSubtotal = numeral(
                  item.base_price * item.qty_ordered,
                ).format(`$0,0.00`);
                const itemTax = numeral(item.tax_amount).format(`$0,0.00`);
                const itemDiscount = numeral(
                  item.discount_amount ||
                    item.promotion_discount + item.coupon_discount,
                ).format(`$0,0.00`);
                const itemTotal = numeral(item.row_total_incl_tax).format(
                  `$0,0.00`,
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box
                        key={item.id}
                        sx={{
                          alignItems: 'center',
                          backgroundColor: 'neutral.50',
                          backgroundImage: `url(${
                            item.product.images.find(
                              ({ tag }) => tag === 'PRINCIPAL',
                            )?.url
                          })`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          borderRadius: 1,
                          display: 'flex',
                          height: 60,
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: 60,
                          boxSizing: 'content-box',
                          // marginLeft: '-8px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Link
                          variant="caption"
                          component={NextLink}
                          href={`/products/${item.product_id}`}
                        >
                          {item.product.name?.value}
                        </Link>
                        <Typography color="text.secondary" variant="caption">
                          SKU. {item.product.sku}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          REF. {item.product.reference}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{itemOriginalPrice}</TableCell>
                    <TableCell align="center">{itemDiscount}</TableCell>
                    <TableCell align="center">{itemPrice}</TableCell>
                    <TableCell align="center">{item.qty_ordered}</TableCell>
                    <TableCell align="center">{itemSubtotal}</TableCell>
                    <TableCell align="center">
                      <Tooltip placement="top" title={`${item.tax_percent}%`}>
                        <span>{itemTax}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{itemTotal}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={7} />
                <TableCell align="center" variant="footer">
                  Valor individual
                </TableCell>
                <TableCell align="center" variant="footer">
                  Cómputo
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Total sin descuento
                </TableCell>
                <TableCell align="center">
                  {numeral(
                    Math.abs(order.base_subtotal_without_discount),
                  ).format(`$0,0.00`)}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(
                    Math.abs(order.base_subtotal_without_discount),
                  ).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Descuento
                </TableCell>
                <TableCell align="center">
                  {numeral(Math.abs(order.base_discount_amount)).format(
                    `$0,0.00`,
                  )}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(
                    order.base_subtotal_without_discount -
                      order.base_discount_amount,
                  ).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Puntos gastados
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                  {`${finalUsedPoints} punto${
                    finalUsedPoints !== 1 ? 's' : ''
                  } (${numeral(finalUsedPoints * 0.05).format('$0,0.00')})`}
                </TableCell>
                <TableCell
                  align="center"
                  variant="footer"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {numeral(
                    Math.abs(
                      order.base_subtotal_without_discount -
                        order.base_discount_amount,
                    ) - order.base_reward_points_discount_amount,
                  ).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Subtotal (Sin IVA)
                </TableCell>
                <TableCell align="center">
                  {numeral(order.base_subtotal).format(`$0,0.00`)}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(order.base_subtotal).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Impuestos
                </TableCell>
                <TableCell align="center">
                  {numeral(order.base_tax_amount).format(`$0,0.00`)}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(order.base_subtotal + order.base_tax_amount).format(
                    `$0,0.00`,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Gastos de envío
                </TableCell>
                <TableCell align="center">
                  {numeral(order.shipping_incl_tax).format(`$0,0.00`)}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(
                    order.base_subtotal_incl_tax + order.shipping_incl_tax,
                  ).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} />
                <TableCell
                  align="right"
                  variant="head"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Total
                </TableCell>
                <TableCell align="center">
                  {numeral(order.base_grand_total).format(`$0,0.00`)}
                </TableCell>
                <TableCell align="center" variant="footer">
                  {numeral(
                    order.subtotal_without_discount -
                      order.tax_amount +
                      order.shipping_incl_tax +
                      order.base_tax_amount -
                      Math.abs(order.base_discount_amount) -
                      usedPoints * 0.05,
                  ).format(`$0,0.00`)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={order.lines?.length || 0}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={0}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Productos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Card>
  );
};

OrderItems.propTypes = {
  items: PropTypes.array.isRequired,
};
