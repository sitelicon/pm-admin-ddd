import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
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
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { useStores } from '../../hooks/use-stores';
import { StoreListSearch } from '../../sections/store/list-search';
import { StoreListTable } from '../../sections/store/list-table';

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

const Page = () => {
  const { search, updateSearch } = useSearch();
  const stores = useStores();
  const storesCount = stores.length;
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
        <title>Listado de tiendas online | PACOMARTINEZ</title>
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
                <Typography variant="h5">Listado de tiendas online</Typography>
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
                    Tiendas online
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon />}
                  variant="text"
                  // onClick={() => setOpenCreateModal(true)}
                >
                  Añadir tienda online
                </Button>
              </Stack>
            </Stack>
            <Card>
              <StoreListSearch
                open={filtersOpen}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
              />
              <StoreListTable
                loading={false}
                pickupStores={stores}
                pickupStoresCount={storesCount}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                perPage={search.perPage}
                page={search.page}
                refetch={() => {}}
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
