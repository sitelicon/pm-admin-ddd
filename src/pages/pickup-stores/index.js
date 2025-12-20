import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { pickupStoresApi } from '../../api/pickup-stores';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { PickupStoreListSearch } from '../../sections/pickup-store/pickup-store-list-search';
import { PickupStoreListTable } from '../../sections/pickup-store/pickup-store-list-table';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { useDebounce } from 'usehooks-ts';
import { PickupStoreCreateModal } from '../../sections/pickup-store/pickup-store-create-modal';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      search: undefined,
      name: undefined,
      email: undefined,
      phone: undefined,
      groupId: undefined,
      storeId: undefined,
    },
    page: 0,
    perPage: 50,
    sortBy: 'created_at',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const usePickupStores = (search) => {
  const [state, setState] = useState({
    pickupStores: [],
    pickupStoresCount: 0,
    loading: true,
  });

  const getPickupStores = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await pickupStoresApi.getStores(search);
      setState({
        pickupStores: response,
        pickupStoresCount: response.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [search]);

  useEffect(
    () => {
      getPickupStores();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return { ...state, refetch: getPickupStores };
};

const Page = () => {
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { pickupStores, pickupStoresCount, loading, refetch } =
    usePickupStores(debouncedSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  usePageView();

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },
    [updateSearch],
  );

  const handleSortChange = useCallback(
    (sort) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
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
        <title>Listado de tiendas | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de tiendas físicas</Typography>
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
                    href={paths.pickupStores.index}
                    variant="subtitle2"
                  >
                    Tiendas físicas
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color={filtersOpen ? 'primary' : 'black'}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <FilterFunnel01 />
                    </SvgIcon>
                  }
                  variant="text"
                  onClick={() => setFiltersOpen((prevState) => !prevState)}
                >
                  Filtros
                </Button>
                <Button
                  color="primary"
                  startIcon={<PlusIcon />}
                  variant="text"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Añadir tienda física
                </Button>
                <PickupStoreCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  onConfirm={() => {
                    setOpenCreateModal(false);
                    refetch();
                  }}
                />
              </Stack>
            </Stack>
            <Card>
              <PickupStoreListSearch
                open={filtersOpen}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
              />
              <PickupStoreListTable
                loading={loading}
                pickupStores={pickupStores}
                pickupStoresCount={pickupStoresCount}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                perPage={search.perPage}
                page={search.page}
                refetch={refetch}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
