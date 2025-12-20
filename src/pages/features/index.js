import React, { useCallback, useEffect, useState } from 'react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import Head from 'next/head';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import NextLink from 'next/link';
import { Columns03 } from '@untitled-ui/icons-react';
import { MultiSelect } from '../../components/multi-select';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
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
import { featuresApi } from '../../api/features';
import { FeatureCreateModal } from '../../sections/feature/feature-create-modal';
import { FeatureListTable } from '../../sections/feature/feature-list-table';
import { FeatureListSearch } from '../../sections/feature/feature-list-search';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      search: undefined,
    },
    page: 0,
    perPage: 50,
    sortBy: 'created_at',
    sortDirection: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useFeatures = (search) => {
  const [state, setState] = useState({
    features: [],
    featuresCount: 0,
    loading: true,
  });

  const getFeatures = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await featuresApi.getFeatures(search);
      setState((prevState) => ({
        ...prevState,
        features: response.data,
        featuresCount: response.total,
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
    getFeatures();
  }, [getFeatures]);

  return { ...state, refetch: () => getFeatures() };
};

const Page = () => {
  const { search, updateSearch } = useSearch();
  const { features, featuresCount, loading, refetch } = useFeatures(search);
  const [openCreateModal, setOpenCreateModal] = useState(false);

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
        <title>Listado de características | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Características</Typography>
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
                    href={paths.features.index}
                    variant="subtitle2"
                  >
                    Características
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  onClick={() => setOpenCreateModal(true)}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Crear caracteristica
                </Button>
                <FeatureCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  onConfirm={refetch}
                />
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <FeatureListSearch
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDirection={search.sortDir}
              />
              <FeatureListTable
                loading={loading}
                features={features}
                featuresCount={featuresCount}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                perPage={search.perPage}
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
