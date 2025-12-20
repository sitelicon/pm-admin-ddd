import NextLink from 'next/link';
import { format } from 'date-fns';
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
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { Hearts, Telescope } from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';

export const CustomerWishlists = ({ wishlists, ...other }) => {
  return (
    <Card {...other}>
      <CardHeader
        action={<MoreMenu />}
        title="Lista de deseos"
        subheader="Productos que el usuario ha marcado como favoritos"
        subheaderTypographyProps={{
          sx: { mt: 0.5 },
          variant: 'body2',
        }}
      />
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Imagen</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Referencia</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wishlists.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Hearts />
                    </SvgIcon>
                    <Typography variant="subtitle2" color="text.secondary">
                      No se han encontrado productos en la lista de deseos del
                      usuario.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {wishlists.map((wishlist) => {
              const { product } = wishlist;
              const productThumbnail = product.images.find(
                ({ tag }) => tag === 'PRINCIPAL',
              );
              return (
                <TableRow key={wishlist.id}>
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
                          backgroundImage: `url(${productThumbnail.url})`,
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
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Link
                      color="inherit"
                      component={NextLink}
                      href={`/products/${product.id}`}
                      variant="caption"
                    >
                      {product.name?.value || 'Producto descatalogado'}
                    </Link>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.reference}</TableCell>
                  <TableCell>
                    {format(new Date(product.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
