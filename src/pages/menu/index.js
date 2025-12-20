import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useCallback, useEffect, useState } from 'react';
import { CategoryImageList } from '../../sections/menu/menu-category-image-list';
import { categoriesApi } from '../../api/categories';

const useCategories = () => {
  const [state, setState] = useState({
    loading: true,
    categories: [],
    categoriesCount: 0,
    error: undefined,
  });

  const getCategories = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await categoriesApi.getCategoriesImagesList();
      setState((prevState) => ({
        ...prevState,
        loading: false,
        categories: response,
        categoriesCount: response.length,
      }));
    } catch (error) {}
  }, []);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    loading: state.loading,
    categories: state.categories,
    categoriesCount: state.categoriesCount,
    error: state.error,
  };
};

const tenants = [
  { id: 1, label: '🇪🇸 Español' },
  { id: 2, label: '🇬🇧 Inglés' },
  { id: 3, label: '🇫🇷 Francés' },
  { id: 4, label: '🇵🇹 Portugués' },
  { id: 5, label: '🇮🇹 Italiano' },
  { id: 6, label: '🇩🇪 Alemán' },
  { id: 7, label: '🇵🇹(M)' },
];

const columnOptions = [
  {
    id: 1,
    label: 'Categoria',
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
    label: 'Idioma',
    value: 'language',
    align: 'left',
  },
];

const Menu = () => {
  const { loading, categories, categoriesCount } = useCategories();
  return (
    <>
      <Head>
        <title>Imágenes del menú | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Imágenes del menú</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.index}
                  variant="subtitle2"
                >
                  Inicio
                </Link>
              </Breadcrumbs>
            </Stack>
          </Stack>
        </Box>
        <CategoryImageList
          columns={columnOptions}
          categories={categories}
          categoriesCount={categoriesCount}
          loading={loading}
        />
      </Box>
    </>
  );
};

Menu.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Menu;
