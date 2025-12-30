import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Cookies from 'js-cookie';
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
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Columns03 } from '@untitled-ui/icons-react';
import { useDebounce, useLocalStorage } from '@uidotdev/usehooks';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { usePageView } from '../../hooks/use-page-view';
import { countriesAPI } from '../../api/countries';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { MultiSelect } from '../../components/multi-select';
import { CountryCreateModal } from '../../sections/countries/countries-create-modal';
import { CountriesListTable } from '../../sections/countries/countries-list-table';
import { CountriesSearch } from '../../sections/countries/countries-list-search';

const useSearch = () => {
  const getInitialSearch = () => {
    const cookie = Cookies.get('countries_search');
    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch (e) {
        console.error('Error al traer las cookies:', e);
      }
    }
    return {
      filters: {
        search: undefined,
        createdFrom: undefined,
        createdTo: undefined,
      },
      page: 1,
      perPage: 25,
      sortBy: 'name',
      sortDir: 'asc',
    };
  };

  const [search, setSearch] = useState(getInitialSearch);

  useEffect(() => {
    Cookies.set('countries_search', JSON.stringify(search), { expires: 7 });
  }, [search]);

  return {
    search,
    updateSearch: setSearch,
  };
};

const useCountries = (search) => {
  const [state, setState] = useState({
    countries: [],
    countriesCount: 0,
    loading: true,
  });

  const getCountries = useCallback(async (request) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await countriesAPI.getCountries(request);
      setState({
        countries: response.items,
        countriesCount: response.total,
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

  const createCountry = useCallback(async (countryData) => {
    try {
      const response = await countriesAPI.createCountry(countryData);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    getCountries(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    ...state,
    createCountry,
  };
};

const columnOptions = [
  {
    id: 1,
    label: 'Nombre oficial',
    value: 'name',
    align: 'center',
  },
  {
    id: 2,
    label: 'Nombre',
    value: 'nicename',
    align: 'center',
  },
  {
    id: 3,
    label: 'ISO',
    value: 'iso',
    align: 'center',
  },
  {
    id: 4,
    label: 'ISO3',
    value: 'iso3',
    align: 'center',
  },
  {
    id: 5,
    label: 'Formato código postal',
    value: 'postal_code_format',
    align: 'center',
  },
  {
    id: 6,
    label: 'Regex código postal',
    value: 'postal_code_regex',
    align: 'center',
  },
];

const Page = () => {
  usePageView();
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { countries, countriesCount, loading, createCountry } =
    useCountries(debouncedSearch);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [columns, setColumns] = useLocalStorage(
    'countriesListColumns',
    columnOptions.map((col) => col.value),
  );

  const handlePageChange = useCallback(
    (event, page) => {
      event.preventDefault();
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

  return (
    <>
      <Head>
        <title>Países | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Países</Typography>
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
                    href={paths.countries.index}
                    variant="subtitle2"
                  >
                    Países
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
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
                  Crear país
                </Button>
                <CountryCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  createCountry={createCountry}
                />
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <CountriesSearch
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
              />
              <CountriesListTable
                columns={columns}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                countries={countries}
                countriesCount={countriesCount}
                perPage={search.perPage}
                loading={loading}
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
