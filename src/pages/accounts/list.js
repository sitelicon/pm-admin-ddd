import { useCallback, useEffect, useState } from 'react';
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
import { usersApi } from '../../api/users';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { useDebounce } from 'usehooks-ts';
import { AccountListSearch } from '../../sections/account/account-list-search';
import { AccountListTable } from '../../sections/account/account-list-table';
import { AccountCreateModal } from '../../sections/account/account-create-modal';

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

const useAccounts = (search) => {
  const [state, setState] = useState({
    accounts: [],
    accountsCount: 0,
    loading: true,
  });

  const getAccounts = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await usersApi.getUsers(search);
      setState({
        accounts: response.items ?? [],
        accountsCount: response.total,
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

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return { ...state, refetch: () => getAccounts() };
};

const Page = () => {
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { accounts, accountsCount, loading, refetch } =
    useAccounts(debouncedSearch);
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
        <title>Listado de cuentas | PACOMARTINEZ</title>
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
                <Typography variant="h5">Listado de cuentas</Typography>
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
                    href={paths.accounts.index}
                    variant="subtitle2"
                  >
                    Gestión de cuentas
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
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Crear cuenta
                </Button>
                <AccountCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  onConfirm={refetch}
                />
              </Stack>
            </Stack>
            <Card>
              <AccountListSearch
                open={filtersOpen}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
              />
              <AccountListTable
                loading={loading}
                accounts={accounts}
                refetch={refetch}
                accountsCount={accountsCount}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                perPage={search.perPage}
                page={search.page}
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
