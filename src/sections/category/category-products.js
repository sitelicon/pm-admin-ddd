import { use, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import NextLink from 'next/link';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import { useDebounce } from '@uidotdev/usehooks';
import {
  useMediaQuery,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
  Delete,
  FilterFunnel01,
  Grid01,
  Heart,
  List,
  Trash01,
} from '@untitled-ui/icons-react';
import { SeverityPill } from '../../components/severity-pill';
import { Scrollbar } from '../../components/scrollbar';
import { categoriesApi } from '../../api/categories';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/use-auth';

const SortableItem = SortableElement(
  ({ product, sortIndex, updating, moveRowDown, moveRowUp }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getImageSource = (name) => {
      const image = product.images.find((image) => image.tag === name);
      return (
        image?.url ||
        product.images.sort((a, b) => a.priority - b.priority)[0]?.url
      );
    };
    const mainImage = getImageSource('PRINCIPAL');
    const secondaryImage = getImageSource('THUMBNAIL');
    const price = numeral(product.prices[0]?.price || 0).format('$0,0.00');
    const hasDiscount = !!product.prices[0]?.price_discount;
    const discount = numeral(product.prices[0]?.price_discount || 0).format(
      '$0,0.00',
    );
    const isXs = useMediaQuery((theme) => theme.breakpoints.down('xs'));
    const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const isMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const isDisabled = product.draft || product.stores?.length === 0;

    return (
      <Grid
        tabIndex={sortIndex}
        item
        key={product.id}
        xs={12}
        sm={6}
        md={3}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: (theme) => theme.palette.background.paper,
            cursor: updating ? 'not-allowed' : 'grab',
            userSelect: 'none',
          }}
        >
          <Box sx={{ height: '100%' }}>
            {/* <Typography
            variant="subtitle2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            {sortIndex + 1}
          </Typography> */}
            {!isDisabled && mainImage && (
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  backgroundImage: `url(${
                    isHovered ? secondaryImage : mainImage
                  })`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 0,
                  display: 'flex',
                  height: 150,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: '100%',
                  filter: updating ? 'grayscale(100%)' : 'none',
                }}
              />
            )}
            {!isDisabled && !mainImage && (
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  borderRadius: 1,
                  display: 'flex',
                  height: 150,
                  justifyContent: 'center',
                  width: 'auto',
                }}
              >
                <SvgIcon>
                  <Image01Icon />
                </SvgIcon>
              </Box>
            )}
            {isDisabled && !mainImage && (
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  borderRadius: 1,
                  display: 'flex',
                  height: 150,
                  justifyContent: 'center',
                  width: 'auto',
                }}
              >
                <SeverityPill color="error">Deshabilitado</SeverityPill>
              </Box>
            )}
            {isDisabled && mainImage && (
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  backgroundImage: `url(${
                    isHovered ? secondaryImage : mainImage
                  })`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 0,
                  display: 'flex',
                  height: 150,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: '100%',
                  filter: updating ? 'grayscale(100%)' : 'none',
                }}
              >
                <SeverityPill
                  sx={{
                    width: '100%',
                    p: 1,
                  }}
                  color="error"
                >
                  Deshabilitado
                </SeverityPill>
              </Box>
            )}
            <Box sx={{ px: 1, py: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {product.name?.value || 'Producto descatalogado'}
                </Typography>
                <SvgIcon fontSize="small">
                  <Heart />
                </SvgIcon>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontSize={14}
                  sx={{ textDecoration: hasDiscount ? 'line-through' : 'none' }}
                >
                  {price}
                </Typography>
                {hasDiscount && (
                  <Typography variant="caption" color="error" fontSize={14}>
                    {discount}
                  </Typography>
                )}
              </Stack>
              {sortIndex % 4 === 3 && (
                <Box>
                  <Button onClick={() => moveRowUp(sortIndex)}>↑</Button>
                  <Button onClick={() => moveRowDown(sortIndex)}>↓</Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  },
);

const SortableList = SortableContainer(
  ({ items, updating, moveRowDown, moveRowUp }) => {
    return (
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {items.map((product, index) => (
          <SortableItem
            key={product.id}
            index={index}
            sortIndex={index}
            product={product}
            disabled={updating}
            updating={updating}
            products={items}
            moveRowDown={moveRowDown}
            moveRowUp={moveRowUp}
          />
        ))}
      </Grid>
    );
  },
);

const ProductListItem = ({
  product,
  onUpdate,
  updating,
  deletingProduct,
  onDelete,
  selectedProducts = [],
  setSelectedProducts,
}) => {
  const { user } = useAuth();
  const [position, setPosition] = useState(product.pivot.position);
  const image =
    product.images.find(({ tag }) => tag === 'PRINCIPAL')?.url ||
    product.images[0]?.url ||
    '';
  const isChecked = selectedProducts.includes(product.id);
  const isDisabled = product.draft || product.stores?.length === 0;
  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onUpdate(product.pivot.id, position);
    },
    [product.pivot.id, position, onUpdate],
  );

  const handleDelete = useCallback(
    (event) => {
      event.preventDefault();
      if (
        window.confirm(
          '¿Estás seguro de que quieres eliminar este producto de la categoría?',
        )
      ) {
        onDelete(product.id);
      }
    },
    [product.id, onDelete],
  );

  const handleValueChange = (productId) => (event) => {
    let newValue = [...selectedProducts];

    if (event.target.checked) {
      newValue.push(productId);
    } else {
      newValue = newValue.filter((item) => item !== productId);
    }

    setSelectedProducts(newValue);
  };

  return (
    <TableRow key={product.id} hover>
      <TableCell align="center">
        <Checkbox
          checked={isChecked}
          onChange={handleValueChange(product.id)}
          value={product.id}
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" alignItems="center" justifyContent="center">
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
          >
            {isDisabled && (
              <SeverityPill color="error">Deshabilitado</SeverityPill>
            )}
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={1}>
          <Link
            color="primary"
            component={NextLink}
            href={`/products/${product.id}`}
            variant="caption"
          >
            {product.name?.value || 'Producto descatalogado'}
          </Link>
          <Typography color="text.secondary" variant="caption">
            SKU. {product.sku}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            REF. {product.reference}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <SeverityPill size="small" color={product.draft ? 'error' : 'success'}>
          {product.draft ? 'Deshabilitado' : 'Habilitado'}
        </SeverityPill>
      </TableCell>
      <TableCell>
        <form onSubmit={handleFormSubmit}>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            spacing={1}
          >
            <TextField
              fullWidth
              label="Posición"
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={updating}
            />
            <Button
              type="submit"
              variant="text"
              color="primary"
              disabled={updating || deletingProduct || !user.role.can_edit}
            >
              {updating ? 'Guardando…' : 'Guardar'}
            </Button>
          </Stack>
        </form>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            type="button"
            variant="text"
            color="error"
            disabled={updating || deletingProduct || !user.role.can_edit}
            onClick={handleDelete}
          >
            {deletingProduct ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export const CategoryProducts = ({
  categoryId,
  products: defaultProducts,
  refetch,
}) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [products, setProducts] = useState(
    defaultProducts.sort((a, b) => a.pivot.position - b.pivot.position),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [draft, setDraft] = useState('false');
  const [skuOrRef, setSkuOrRef] = useState(undefined);
  const [name, setName] = useState(undefined);
  const debouncedName = useDebounce(name, 300);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const productsFiltered = useMemo(() => {
    return products
      .filter((product) => {
        if (draft === 'all') {
          return true;
        }

        return product.draft === (draft === 'true');
      })
      .filter((product) => {
        if (!skuOrRef) {
          return true;
        }
        return (
          product.sku.toLowerCase().includes(skuOrRef.toLowerCase()) ||
          product.reference.toLowerCase().includes(skuOrRef.toLowerCase())
        );
      })
      .filter((product) => {
        if (!debouncedName) {
          return true;
        }
        return product.name?.value
          .toLowerCase()
          .includes(debouncedName.toLowerCase());
      });
  }, [products, draft, skuOrRef, debouncedName]);

  const deleteProduct = useCallback(
    async (productId) => {
      try {
        setDeletingProduct(true);
        await categoriesApi.deleteProduct(categoryId, productId);
        toast.success('Producto eliminado');
        setProducts((prev) =>
          prev.filter((product) => product.id !== productId),
        );
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar el producto');
      } finally {
        setDeletingProduct(false);
      }
    },
    [categoryId],
  );

  const updateProductPosition = useCallback(async (id, position) => {
    try {
      setUpdating(true);
      await categoriesApi.updateProductPosition(id, position);
      toast.success('Posición del producto actualizada');
      setProducts((prev) =>
        prev
          .map((product) => {
            if (product.pivot.id === id) {
              return {
                ...product,
                pivot: {
                  ...product.pivot,
                  position,
                },
              };
            }
            return product;
          })
          .sort((a, b) => a.pivot.position - b.pivot.position),
      );
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar la posición del producto');
    } finally {
      setUpdating(false);
    }
  }, []);

  const bulkUpdateProductPosition = useCallback(
    async (data) => {
      try {
        setUpdating(true);
        await categoriesApi.bulkUpdateProductPosition(data, categoryId);
        setProducts((prev) =>
          prev.map((product, index) => ({
            ...product,
            pivot: {
              ...product.pivot,
              position: index,
            },
          })),
        );
        toast.success('Posición de los productos actualizada');
      } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar la posición de los productos');
      } finally {
        setUpdating(false);
      }
    },
    [categoryId],
  );

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    setProducts((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleDraftChange = (event) => {
    const { value } = event.target;
    setDraft(value === 'all' ? undefined : value);
  };

  const handleSkuOrRefChange = (event) => {
    const { value } = event.target;
    setSkuOrRef(value === '' ? undefined : value);
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value === '' ? undefined : value);
  };

  const handleSaveProducts = () => {
    const changedProducts = products.reduce((acc, product, index) => {
      if (product.pivot.position !== index) {
        acc.push({ id: product.pivot.id, position: index });
      }
      return acc;
    }, []);

    bulkUpdateProductPosition(changedProducts);
  };

  const handleBulKEliminateProducts = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast.error('No hay productos seleccionados');
      return;
    }

    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar los productos seleccionados de la categoría? Se eliminarán ${selectedProducts.length} productos`,
      )
    ) {
      try {
        setDeletingProduct(true);
        await categoriesApi.deleteBulkProduct(categoryId, selectedProducts);
        toast.success('Productos eliminados de la categoría');
      } catch (error) {
        console.error(error);
        toast.error('No se pudo eliminar los productos');
      } finally {
        setDeletingProduct(false);
      }
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id)),
      );
      setSelectedProducts([]);
      setAllSelected(false);
    }
  }, [categoryId, selectedProducts]);

  const moveRowUp = (index) => {
    if (index < 4) return;
    const newProducts = [...products];
    const row = newProducts.splice(index - 3, 4);
    newProducts.splice(index - 7, 0, ...row);
    setProducts(newProducts);
  };

  const moveRowDown = (index) => {
    if (index >= products.length - 4) return;
    const newProducts = [...products];
    const row = newProducts.splice(index - 3, 4);
    newProducts.splice(index + 1, 0, ...row);
    setProducts(newProducts);
  };

  const handleSelectedAllChange = useCallback(
    (event) => {
      if (event.target.checked) {
        setSelectedProducts(products.map((product) => product.id));
        setAllSelected(true);
      } else {
        setSelectedProducts([]);
        setAllSelected(false);
      }
    },
    [productsFiltered, products],
  );

  return (
    <Card item>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={1}>
              <Typography variant="h6">Gestionar productos</Typography>
              <Typography variant="body2" color="text.secondary">
                Hay {products.length} productos en la categoría
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {layout === 'grid' && (
                <Button
                  onClick={handleSaveProducts}
                  disabled={updating || !user.role.can_edit}
                >
                  {updating ? 'Guardando…' : 'Guardar posiciones'}
                </Button>
              )}
              {layout === 'list' && (
                <Tooltip
                  placement="top"
                  title={filtersOpen ? 'Colapsar filtros' : 'Expandir filtros'}
                >
                  <Button
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    disabled={!user.role.can_edit}
                  >
                    <SvgIcon
                      fontSize="small"
                      color={filtersOpen ? 'primary' : 'action'}
                    >
                      <FilterFunnel01 />
                    </SvgIcon>
                  </Button>
                </Tooltip>
              )}
              <Tooltip placement="top" title="Ver cuadrícula">
                <Button
                  onClick={() => {
                    setLayout('grid');
                    setFiltersOpen(false);
                    if (draft !== 'false' || skuOrRef || name) {
                      setDraft('false');
                      setSkuOrRef(undefined);
                      setName(undefined);
                    }
                  }}
                >
                  <SvgIcon
                    fontSize="small"
                    color={layout === 'grid' ? 'primary' : 'action'}
                  >
                    <Grid01 />
                  </SvgIcon>
                </Button>
              </Tooltip>
              <Tooltip placement="top" title="Ver listado">
                <Button onClick={() => setLayout('list')}>
                  <SvgIcon
                    fontSize="small"
                    color={layout === 'list' ? 'primary' : 'action'}
                  >
                    <List />
                  </SvgIcon>
                </Button>
              </Tooltip>
              {layout === 'list' && (
                <Tooltip placement="top" title="Eliminar">
                  <Button
                    onClick={handleBulKEliminateProducts || !user.role.can_edit}
                  >
                    <SvgIcon
                      fontSize="small"
                      color={layout === 'grid' ? 'primary' : 'action'}
                    >
                      <Trash01 />
                    </SvgIcon>
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Stack>
          <Divider />
          {layout === 'list' && (
            <Collapse in={filtersOpen}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontSize={10}
                      >
                        Estado
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        onChange={handleDraftChange}
                        select
                        SelectProps={{ native: true }}
                        value={draft || 'all'}
                      >
                        <option value="">Todos</option>
                        <option value="true">Deshabilitado</option>
                        <option value="false">Habilitado</option>
                      </TextField>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontSize={10}
                      >
                        Nombre
                      </Typography>
                      <TextField
                        fullWidth
                        hiddenLabel
                        onChange={handleNameChange}
                        value={name || ''}
                        placeholder="Filtrar por nombre"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontSize={10}
                      >
                        SKU / Referencia
                      </Typography>
                      <TextField
                        hiddenLabel
                        onChange={handleSkuOrRefChange}
                        value={skuOrRef || ''}
                        placeholder="Filtrar por SKU o referencia"
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Divider />
              </Stack>
            </Collapse>
          )}
        </Stack>
        {layout === 'grid' && (
          <SortableList
            axis="xy"
            items={products}
            onSortEnd={handleSortEnd}
            helperClass="sortable-helper"
            lockToContainerEdges
            useWindowAsScrollContainer
            updating={updating}
            moveRowDown={moveRowDown}
            moveRowUp={moveRowUp}
          />
        )}
        {layout === 'list' && (
          <Box>
            {selectedProducts.length > 0 && (
              <Stack
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
                sx={{ pb: 3, pt: 1 }}
              >
                <Typography variant="body2">
                  {selectedProducts.length} producto(s) seleccionado(s)
                </Typography>
                <Button onClick={handleBulKEliminateProducts}>
                  Eliminar selección
                </Button>
              </Stack>
            )}
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox
                        checked={allSelected}
                        onChange={handleSelectedAllChange}
                      />
                    </TableCell>
                    <TableCell align="center">Imagen</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Posición</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          textAlign="center"
                          sx={{ p: 3 }}
                        >
                          No hay productos que mostrar
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {products
                    // .filter((product) => {
                    //   if (draft === 'all') {
                    //     return true;
                    //   }
                    //   return product.draft === (draft === 'true');
                    // })
                    .filter((product) => {
                      if (!skuOrRef) {
                        return true;
                      }
                      return (
                        product.sku
                          .toLowerCase()
                          .includes(skuOrRef.toLowerCase()) ||
                        product.reference
                          .toLowerCase()
                          .includes(skuOrRef.toLowerCase())
                      );
                    })
                    .filter((product) => {
                      if (!debouncedName) {
                        return true;
                      }
                      return product.name?.value
                        .toLowerCase()
                        .includes(debouncedName.toLowerCase());
                    })
                    .sort((a, b) => a.pivot.position - b.pivot.position)
                    .map((product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        onUpdate={updateProductPosition}
                        updating={updating}
                        deletingProduct={deletingProduct}
                        onDelete={deleteProduct}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

CategoryProducts.propTypes = {
  products: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};
