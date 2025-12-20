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

export const ShipmentLines = ({ shipment }) => {
  return (
    <Card>
      <CardHeader title="Productos" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Imagen</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell align="center">Cantidad enviada</TableCell>
              <TableCell align="center">Peso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipment.shipment_lines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 3 }}>
                  <Typography
                    align="center"
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    No hay productos en este envío.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {shipment.shipment_lines.map((item) => {
              const { product } = item.order_line;
              const image =
                product.images.find(({ tag }) => tag === 'PRINCIPAL')?.url ||
                product.images[0]?.url ||
                '';

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
                          height: 80,
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: 80,
                          boxSizing: 'content-box',
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
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
                    </Stack>
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">
                    {item.order_line.row_weight}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

ShipmentLines.propTypes = {
  shipment: PropTypes.object.isRequired,
};
