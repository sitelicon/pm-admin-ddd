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
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Columns03 } from '@untitled-ui/icons-react';
import { useDebounce } from '@uidotdev/usehooks';
import { colorsApi } from '../../api/colors';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { ColorListTable } from '../../sections/colors/colors-list-table';
import { ColorCreateModal } from '../../sections/colors/colors-create-modal';
import { MultiSelect } from '../../components/multi-select';
import { useLocalStorage } from '../../hooks/use-local-storage';

const useSearch = () => {
  const [search, setSearch] = useLocalStorage('colorListSearch', {
    filters: {
      name_admin: undefined,
      hexadecimal: undefined,
    },
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useColors = (search) => {
  // const isMounted = useMounted();
  const [state, setState] = useState({
    colors: [],
    colorsCount: 0,
    loading: true,
  });

  const getColors = useCallback(async (request) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await colorsApi.getColors(request);
      setState({
        colors: response,
        colorsCount: response,
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
    getColors(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const columnOptions = [
  {
    id: 1,
    label: 'Paleta',
    value: 'pallete',
    align: 'center',
  },
  {
    id: 2,
    label: 'Nombre',
    value: 'name_admin',
    align: 'left',
  },
  {
    id: 3,
    label: 'HEXADECIMAL',
    value: 'hexadecimal',
    align: 'left',
  },
  {
    id: 4,
    label: 'ESPAÑOL',
    value: 'language_es',
    align: 'center',
  },
  {
    id: 5,
    label: 'PORTUGUÉS',
    value: 'language_pt',
    align: 'center',
  },
  {
    id: 6,
    label: 'FRANCÉS',
    value: 'language_fr',
    align: 'center',
  },
  {
    id: 7,
    label: 'ITALIANO',
    value: 'language_it',
    align: 'center',
  },
  {
    id: 8,
    label: 'INGLES',
    value: 'language_en',
    align: 'center',
  },
];

const ColorsList = () => {
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { colors, colorsCount, loading } = useColors(debouncedSearch);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [columns, setColumns] = useLocalStorage(
    'colorsListColumns',
    columnOptions.map((col) => col.value),
  );

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
        <title>Listado de colores | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Catálogo de colores</Typography>
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
                    href={paths.colors.index}
                    variant="subtitle2"
                  >
                    Colores
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
                  Crear color
                </Button>
                <ColorCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                />
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <ColorListTable
                columns={columns}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                colors={colors}
                colorsCount={colorsCount}
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

ColorsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ColorsList;
