import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Box,
  Button,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  MenuItem,
  Skeleton,
  Stack,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { Telescope } from '@untitled-ui/icons-react';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useStores } from '../../hooks/use-stores';
import { useSelectionModel } from '../../hooks/use-selection-model';
import moment from 'moment';
import { productsApi } from '../../api/products';

export const ProductListTable = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    page,
    products,
    productsCount,
    perPage,
    loading,
    columns,
    refetch,
    ...other
  } = props;

  const stores = useStores();
  const [enablingProducts, setEnablingProducts] = useState(false);
  const [disablingProducts, setDisablingProducts] = useState(false);

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(products);

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

  const handleEnableSelected = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          `¿Estás seguro de habilitar ${selected.length} los productos seleccionados? Los productos seleccionados se habilitarán en todas las tiendas.`,
        )
      ) {
        try {
          setEnablingProducts(true);
          await productsApi.bulkEnableProducts(selected);
          toast.success('Productos habilitados');
          refetch();
        } catch (error) {
          console.error(error);
          toast.error('No se pudo habilitar los productos');
        } finally {
          setEnablingProducts(false);
        }
      }
    },
    [selected, refetch],
  );

  const handleDisableSelected = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        window.confirm(
          `¿Estás seguro de deshabilitar ${selected.length} los productos seleccionados? Los productos seleccionados se deshabilitarán en todas las tiendas.`,
        )
      ) {
        try {
          setDisablingProducts(true);
          await productsApi.bulkDisableProducts(selected);
          toast.success('Productos deshabilitados');
          refetch();
        } catch (error) {
          console.error(error);
          toast.error('No se pudo deshabilitar los productos');
        } finally {
          setDisablingProducts(false);
        }
      }
    },
    [selected, refetch],
  );

  const selectedAll = selected.length === products.length;
  const selectedSome = selected.length > 0 && selected.length < products.length;
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
          <Button
            color="primary"
            size="small"
            onClick={handleEnableSelected}
            disabled={enablingProducts || disablingProducts}
          >
            {enablingProducts ? 'Habilitando…' : 'Habilitar'}
          </Button>
          <Button
            color="error"
            size="small"
            onClick={handleDisableSelected}
            disabled={enablingProducts || disablingProducts}
          >
            {disablingProducts ? 'Deshabilitando…' : 'Deshabilitar'}
          </Button>
        </Stack>
      )}
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
              {columns.includes('thumbnail') && (
                <TableCell width="1px" align="center">
                  Imagen
                </TableCell>
              )}
              {columns.includes('name') && <TableCell>Nombre</TableCell>}
              {columns.includes('sku') && <TableCell>SKU</TableCell>}
              {columns.includes('price') && (
                <TableCell align="center">Precio</TableCell>
              )}
              {columns.includes('offerPrice') && (
                <TableCell align="center">Precio oferta</TableCell>
              )}
              {columns.includes('stockA1') && (
                <TableCell align="center">Stock A1</TableCell>
              )}
              {columns.includes('stockAvailable') && (
                <TableCell align="center">Stock Disponible</TableCell>
              )}
              {columns.includes('stores') && <TableCell>Tiendas</TableCell>}
              {columns.includes('status') && <TableCell>Estado</TableCell>}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(5)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell width="1px" align="center">
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={50}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  {Array.from(Array(columns.length)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 0 && (
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
            {!loading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 3} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Telescope />
                    </SvgIcon>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron productos que coincidan con los filtros
                      aplicados.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              products.map((product) => {
                const isSelected = selected.includes(product.id);
                const isActive =
                  !!product && !product.draft && !!product.stores?.length;
                const warehouse = product.stock.find(
                  ({ warehouse_id }) => warehouse_id === 1,
                );
                const stock = warehouse?.quantity || 0;
                const availableStock = warehouse?.available_quantity || 0;
                const productPrice = product.prices[0];
                const priceStore = productPrice
                  ? stores.find(({ id }) => id === productPrice.store_id)
                  : null;
                const price = numeral(productPrice?.price || 0).format(
                  '$0,0.00',
                );
                const isOfferActive =
                  (!!productPrice?.price_discount &&
                    !!productPrice?.price_discount_start &&
                    !!productPrice?.price_discount_end &&
                    moment().isBetween(
                      moment(productPrice?.price_discount_start),
                      moment(productPrice?.price_discount_end),
                    )) ||
                  (!!productPrice?.price_discount &&
                    !productPrice?.price_discount_start &&
                    !productPrice?.price_discount_end) ||
                  (!!productPrice?.price_discount &&
                    !!productPrice?.price_discount_start &&
                    !productPrice?.price_discount_end &&
                    moment().isAfter(
                      moment(productPrice?.price_discount_start),
                    )) ||
                  (!!productPrice?.price_discount &&
                    !productPrice?.price_discount_start &&
                    !!productPrice?.price_discount_end &&
                    moment().isBefore(
                      moment(productPrice?.price_discount_end),
                    ));
                const offerPrice = numeral(
                  productPrice?.price_discount || 0,
                ).format('$0,0.00');
                const statusColor = isActive ? 'success' : 'error';
                const hasManyVariants = product.variants > 1;
                const mainImage = product.images.find(
                  (image) => image.tag === 'PRINCIPAL',
                );
                const isDeleted = product.deleted_at !== null;

                return (
                  <TableRow key={product.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(product.id);
                          } else {
                            deselectOne(product.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    {columns.includes('thumbnail') && (
                      <TableCell width="1px">
                        <Stack
                          direction="row"
                          alignContent="center"
                          justifyContent="center"
                        >
                          {mainImage ? (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'neutral.50',
                                backgroundImage: `url(${mainImage.url})`,
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
                                backgroundColor: 'neutral.50',
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
                        </Stack>
                      </TableCell>
                    )}
                    {columns.includes('name') && (
                      <TableCell>
                        <Link
                          component={NextLink}
                          href={`/products/${product.id}`}
                          color="primary"
                          variant="caption"
                        >
                          {product.name?.value || 'Producto descatalogado'}
                        </Link>
                      </TableCell>
                    )}
                    {columns.includes('sku') && (
                      <TableCell>{product.sku}</TableCell>
                    )}
                    {columns.includes('price') && (
                      <TableCell align="center">
                        <Tooltip
                          placement="top"
                          title={
                            <Stack spacing={1}>
                              {product.prices.map((item) => {
                                const value = numeral(item.price || 0).format(
                                  '$0,0.00',
                                );
                                const store = stores.find(
                                  ({ id }) => id === item.store_id,
                                );
                                return (
                                  <Stack
                                    key={item.store_id}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1}
                                  >
                                    {store && (
                                      <Typography variant="caption">
                                        {store.code.toUpperCase()}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="body2"
                                      color={
                                        !!item.price
                                          ? 'inherit'
                                          : 'text.secondary'
                                      }
                                    >
                                      {value}
                                    </Typography>
                                  </Stack>
                                );
                              })}
                            </Stack>
                          }
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                          >
                            {priceStore && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {priceStore.code.toUpperCase()}
                              </Typography>
                            )}
                            <Typography
                              variant="body2"
                              color={
                                isOfferActive ? 'text.secondary' : 'inherit'
                              }
                              sx={{
                                textDecoration: isOfferActive
                                  ? 'line-through'
                                  : 'none',
                              }}
                            >
                              {price}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columns.includes('offerPrice') && (
                      <TableCell align="center">
                        <Tooltip
                          placement="top"
                          title={
                            <Stack spacing={1}>
                              {product.prices.map((item) => {
                                const value = numeral(
                                  item.price_discount || 0,
                                ).format('$0,0.00');
                                const store = stores.find(
                                  ({ id }) => id === item.store_id,
                                );
                                return (
                                  <Stack
                                    key={item.store_id}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={1}
                                  >
                                    {store && (
                                      <Typography variant="caption">
                                        {store.code.toUpperCase()}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant={
                                        item.price_discount
                                          ? 'body2'
                                          : 'caption'
                                      }
                                      color={
                                        item.price_discount
                                          ? 'inherit'
                                          : 'text.secondary'
                                      }
                                    >
                                      {item.price_discount ? value : 'N/A'}
                                    </Typography>
                                  </Stack>
                                );
                              })}
                            </Stack>
                          }
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                          >
                            {isOfferActive ? (
                              <Typography variant="body2" color="error">
                                {offerPrice}
                              </Typography>
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                N/A
                              </Typography>
                            )}
                          </Stack>
                        </Tooltip>
                      </TableCell>
                    )}
                    {columns.includes('stockA1') && (
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={stock > 0 ? 'text.primary' : 'error'}
                        >
                          {stock}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('stockAvailable') && (
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          color={availableStock > 0 ? 'text.primary' : 'error'}
                        >
                          {availableStock}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('stores') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            product.stores.length === 0
                              ? 'text.secondary'
                              : 'text.primary'
                          }
                          whiteSpace="nowrap"
                        >
                          {product.stores.length === 0 && 'Ninguna'}
                          {product.stores
                            .map((store) => store.code.toUpperCase())
                            .join(', ')}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('status') && (
                      <TableCell>
                        {isDeleted ? (
                          <SeverityPill color="error">
                            Producto Eliminado
                          </SeverityPill>
                        ) : (
                          <SeverityPill color={statusColor}>
                            {isActive ? 'Habilitado' : 'Deshabilitado'}
                          </SeverityPill>
                        )}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/products/${product.id}`}
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
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        ActionsComponent={TablePaginationActions}
        labelRowsPerPage="Productos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Box>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  refetch: PropTypes.func.isRequired,
};
