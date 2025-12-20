import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Columns03, FilterFunnel01, Plus } from '@untitled-ui/icons-react';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { MultiSelect } from '../../components/multi-select';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { DiscountListTable } from '../../sections/discount/discount-list-table';
import { usePageView } from '../../hooks/use-page-view';
import { discountsApi } from '../../api/discounts';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      startDate: undefined,
      endDate: undefined,
      stores: [],
      customerGroups: [],
    },
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useDiscounts = (search) => {
  const [state, setState] = useState({
    discounts: [],
    discountsCount: 0,
    loading: true,
  });

  const getDiscounts = useCallback(async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await discountsApi.getDiscounts(search);
      setState({
        discounts: response.items,
        discountsCount: response.pagination.totalItems,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [search]);

  useEffect(
    () => {
      getDiscounts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return state;
};

const columnOptions = [];

const DiscountsList = () => {
  const { search, updateSearch } = useSearch();
  const { discounts, discountsCount, loading } = useDiscounts(search);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [columns, setColumns] = useState(columnOptions.map((col) => col.value));

  usePageView();

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
        <title>Descuentos catálogo | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de descuentos</Typography>
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
                    href={paths.discounts.index}
                    variant="subtitle2"
                  >
                    Descuentos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="black"
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
                  component={NextLink}
                  href={paths.discounts.create}
                  startIcon={
                    <SvgIcon>
                      <Plus />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Añadir descuento
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <DiscountListTable
                columns={columns}
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                discounts={discounts}
                discountsCount={discountsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

DiscountsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DiscountsList;
