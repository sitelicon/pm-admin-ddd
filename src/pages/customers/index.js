import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
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
import { customersApi } from '../../api/customers';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { CustomerListSearch } from '../../sections/customer/customer-list-search';
import { CustomerListTable } from '../../sections/customer/customer-list-table';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { useDebounce } from 'usehooks-ts';

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

//change edu test
const useCustomers = (search) => {
  const [state, setState] = useState({
    customers: [],
    hasNextPage: false,
    hasPrevPage: false,
    loading: true,
  });

  const getCustomers = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await customersApi.getCustomers(search);
      setState((prevState) => ({
        ...prevState,
        customers: response.data,
        hasNextPage: response.has_next_page,
        hasPrevPage: response.has_prev_page,
      }));
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
    getCustomers();
  }, [getCustomers]);

  return state;
};

const Page = () => {
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { customers, hasNextPage, hasPrevPage, loading } =
    useCustomers(debouncedSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        <title>Listado de clientes | PACOMARTINEZ</title>
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
                <Typography variant="h5">Listado de clientes</Typography>
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
                    href={paths.customers.index}
                    variant="subtitle2"
                  >
                    Clientes
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
              </Stack>
            </Stack>
            <Card>
              <CustomerListSearch
                open={filtersOpen}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
              />
              <CustomerListTable
                loading={loading}
                customers={customers}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                perPage={search.perPage}
                page={search.page}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
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
