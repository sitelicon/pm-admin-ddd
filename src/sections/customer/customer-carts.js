import NextLink from 'next/link';
import { format } from 'date-fns';
import {
  AvatarGroup,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { Hearts, Telescope } from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(5, '0');
};

export const CustomerCarts = ({ carts, ...other }) => {
  return (
    <Card {...other}>
      <CardHeader
        action={<MoreMenu />}
        title="Listado de carritos"
        subheader="Carritos creados por el usuario y no han sido finalizados."
        subheaderTypographyProps={{
          sx: { mt: 0.5 },
          variant: 'body2',
        }}
      />
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Última Actualización</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Hearts />
                    </SvgIcon>
                    <Typography variant="subtitle2" color="text.secondary">
                      No se han encontrado carritos asociados al usuario.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {carts.map((cart) => {
              return (
                <TableRow key={cart.id} hover>
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
    </Card>
  );
};
