import NextLink from 'next/link';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardHeader,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { LinkBroken01 } from '@untitled-ui/icons-react';
import PropTypes from 'prop-types';

const returnReasons = {
  wrong_color: 'Color equivocado',
  unlike: 'No me gusta',
  changed_mind: 'He cambiado de idea',
  broken_product: 'Producto estropeado',
  wrong_size: 'Talla equivocada',
  other: 'Otro',
};

export const ReturnLines = ({ orderReturn }) => {
  return (
    <Card>
      <CardHeader title="Productos" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Imagen</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Stock A1</TableCell>
              <TableCell>Total pagado</TableCell>
              <TableCell>Razón</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderReturn.lines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 3 }}>
                  <Typography
                    align="center"
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    No hay productos seleccionados en esta devolución
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {orderReturn.lines.map((item) => {
              const { product } = item.order_line;
              const image =
                product.images.find(({ tag }) => tag === 'PRINCIPAL')?.url ||
                product.images[0]?.url ||
                '';
              const stockA1 =
                product.stock.find(({ warehouse_id }) => warehouse_id === 1)
                  ?.quantity || 0;
              return (
                <TableRow key={item.id}>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: 'neutral.50',
                          backgroundImage: `url(${image})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          borderRadius: 1,
                          display: 'flex',
                          height: 60,
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: 60,
                          boxSizing: 'content-box',
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {product.name?.value ? (
                        <Link
                          color="primary"
                          component={NextLink}
                          href={`/products/${product.id}`}
                          variant="caption"
                        >
                          {product.name?.value}
                        </Link>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip
                            arrow
                            placement="top"
                            title="Este producto ha sido descatalogado y ya no está disponible para su compra."
                          >
                            <SvgIcon color="action" fontSize="small">
                              <LinkBroken01 />
                            </SvgIcon>
                          </Tooltip>
                          <Typography color="text.primary" variant="caption">
                            Producto descatalogado
                          </Typography>
                        </Stack>
                      )}
                      <Typography color="text.secondary" variant="caption">
                        SKU. {product.sku}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        REF. {product.reference}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {numeral(item.order_line.base_price_incl_tax).format(
                      '$0,0.00',
                    )}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{stockA1}</TableCell>
                  <TableCell>
                    {numeral(item.order_line.row_total_incl_tax).format(
                      '$0,0.00',
                    )}
                  </TableCell>
                  <TableCell>{returnReasons[item.reason]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ReturnLines.propTypes = {
  orderReturn: PropTypes.object.isRequired,
};
