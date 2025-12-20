import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { toast } from 'react-hot-toast';
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
import { categoriesApi } from '../../api/categories';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { CategoryListSearch } from '../../sections/category/category-list-search';
import { CategoryListTable } from '../../sections/category/category-list-table';
import { ca } from 'date-fns/locale';
import { useAuth } from '../../hooks/use-auth';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {},
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useCategories = (search) => {
  const isMounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getCategories(search);

      if (isMounted()) {
        setCategories(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, isMounted]);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    categories,
    loading,
    setCategories,
    refetch: () => getCategories(),
  };
};

const CategoryList = () => {
  const { user } = useAuth();
  const { search, updateSearch } = useSearch();
  const { categories, loading, setCategories, refetch } = useCategories(search);

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

  return (
    <>
      <Head>
        <title>Listado de categorías | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de categorías</Typography>
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
                    href={paths.categories.index}
                    variant="subtitle2"
                  >
                    Categorías
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  component={NextLink}
                  href={paths.categories.create}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  disabled={!user.role.can_edit}
                >
                  Crear categoría
                </Button>
              </Stack>
            </Stack>
            <Card>
              {/* <CategoryListSearch onFiltersChange={handleFiltersChange} /> */}
              <CategoryListTable
                categories={categories}
                setCategories={setCategories}
                loading={loading}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CategoryList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoryList;
