import PropTypes from 'prop-types';
import NextLink from 'next/link';
import numeral from 'numeral';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { paths } from '../../paths';

export const EcommerceProducts = ({ products, loading }) => {
  return (
    <Card>
      <CardHeader
        action={<MoreMenu />}
        title="Productos más vendidos"
        subheader="En función del periodo seleccionado"
      />
      <Scrollbar>
        <Table>
          <TableBody>
            {loading &&
              Array.from(Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell width="1px">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={60}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Stack spacing={1}>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width={100} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {!loading &&
              products.map((product, index) => {
                const sales = numeral(product.sales).format('0,0');

                return (
                  <TableRow hover key={product.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        {product.image ? (
                          <Box
                            sx={{
                              alignItems: 'center',
                              backgroundColor: 'neutral.50',
                              backgroundImage: `url(${product.image})`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              borderRadius: 1,
                              display: 'flex',
                              height: 60,
                              justifyContent: 'center',
                              overflow: 'hidden',
                              width: 60,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              alignItems: 'center',
                              backgroundColor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'neutral.700'
                                  : 'neutral.50',
                              borderRadius: 1,
                              display: 'flex',
                              height: 60,
                              justifyContent: 'center',
                              width: 60,
                            }}
                          >
                            <SvgIcon>
                              <Image01Icon />
                            </SvgIcon>
                          </Box>
                        )}
                        <div>
                          <Link
                            component={NextLink}
                            href={`/products/${product.id}`}
                            variant="subtitle2"
                            color="text.primary"
                          >
                            {product.name?.value || 'Producto descatalogado'}
                          </Link>
                          <Typography color="text.secondary" variant="body2">
                            {product.sku}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="success.main" variant="subtitle2">
                        {sales}
                      </Typography>
                      <Typography color="text.secondary" noWrap variant="body2">
                        en ventas
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'neutral.700'
                              : 'neutral.200',
                          borderRadius: 1.5,
                          px: 1,
                          py: 0.5,
                          display: 'inline-block',
                        }}
                      >
                        <Typography variant="subtitle2">
                          #{index + 1}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          LinkComponent={NextLink}
          href={paths.reports.bestsellers}
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          Ver todos
        </Button>
      </CardActions>
    </Card>
  );
};

EcommerceProducts.propTypes = {
  products: PropTypes.array.isRequired,
};
