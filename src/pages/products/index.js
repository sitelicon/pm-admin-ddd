import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Collapse,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import {
  Columns01,
  Columns02,
  Columns03,
  FilterFunnel01,
} from '@untitled-ui/icons-react';
import { useDebounce } from '@uidotdev/usehooks';
import { productsApi } from '../../api/products';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { ProductListSearch } from '../../sections/product/product-list-search';
import { ProductListTable } from '../../sections/product/product-list-table';
import { ProductCreateModal } from '../../sections/product/product-create-modal';
import { MultiSelect } from '../../components/multi-select';
import { useLocalStorage } from '../../hooks/use-local-storage';

const useSearch = () => {
  const [search, setSearch] = useLocalStorage('productListSearch', {
    filters: {
      name: undefined,
      categoryIds: [],
      draft: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minDiscountPrice: undefined,
      maxDiscountPrice: undefined,
      minStock: undefined,
      maxStock: undefined,
      skuOrRef: undefined,
      storeId: undefined,
    },
    page: 0,
    perPage: 25,
    sort: 'created_at:asc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useProducts = (search) => {
  // const isMounted = useMounted();
  const [state, setState] = useState({
    products: [],
    productsCount: 0,
    loading: true,
  });

  const getProducts = useCallback(async (request) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await productsApi.getProducts(request);
      setState({
        products: response.data,
        productsCount: response.total,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getProducts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return { ...state, refetch: () => getProducts(search) };
};

const columnOptions = [
  {
    id: 1,
    label: 'Imagen',
    value: 'thumbnail',
    align: 'center',
  },
  {
    id: 2,
    label: 'Nombre',
    value: 'name',
    align: 'left',
  },
  {
    id: 3,
    label: 'SKU',
    value: 'sku',
    align: 'left',
  },
  {
    id: 4,
    label: 'Precio',
    value: 'price',
    align: 'center',
  },
  {
    id: 5,
    label: 'Precio oferta',
    value: 'offerPrice',
    align: 'center',
  },
  {
    id: 6,
    label: 'Stock A1',
    value: 'stockA1',
    align: 'center',
  },
  {
    id: 7,
    label: 'Stock Disponible',
    value: 'stockAvailable',
    align: 'center',
  },
  {
    id: 8,
    label: 'Tiendas',
    value: 'stores',
    align: 'left',
  },
  {
    id: 9,
    label: 'Estado',
    value: 'status',
    align: 'center',
  },
];

const ProductList = () => {
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { products, productsCount, loading, refetch } =
    useProducts(debouncedSearch);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [columns, setColumns] = useLocalStorage(
    'productListColumns',
    columnOptions.map((col) => col.value),
  );

  usePageView();

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
        page: 0,
      }));
    },
    [updateSearch],
  );

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch],
  );

  const handlePerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        perPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch],
  );

  return (
    <>
      <Head>
        <title>Listado de productos | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Catálogo de productos</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.index}
                  variant="subtitle2"
                >
                  Inicio
                </Link>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.products.index}
                  variant="subtitle2"
                >
                  Productos
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Listado
                </Typography>
              </Breadcrumbs>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={3}>
              <Button
                color={isFiltersOpen ? 'primary' : 'black'}
                startIcon={
                  <SvgIcon fontSize="small">
                    <FilterFunnel01 />
                  </SvgIcon>
                }
                variant="text"
                onClick={() => setIsFiltersOpen((prevState) => !prevState)}
              >
                Filtros
              </Button>
              <MultiSelect
                label="Columnas"
                options={columnOptions}
                value={columns}
                onChange={setColumns}
                color="black"
                startIcon={
                  <SvgIcon fontSize="small">
                    <Columns03 />
                  </SvgIcon>
                }
                variant="text"
              />
              <Button
                onClick={() => setOpenCreateModal(true)}
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
              >
                Crear producto
              </Button>
              <ProductCreateModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
              />
            </Stack>
          </Stack>
        </Box>
        <Divider />
        <ProductListSearch
          open={isFiltersOpen}
          initialFilters={search.filters}
          onFiltersChange={handleFiltersChange}
        />
        <ProductListTable
          columns={columns}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          page={search.page}
          products={products}
          productsCount={productsCount}
          perPage={search.perPage}
          loading={loading}
          refetch={refetch}
        />
      </Box>
    </>
  );
};

ProductList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductList;
