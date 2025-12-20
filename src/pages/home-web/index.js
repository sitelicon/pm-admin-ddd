import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Stack } from '@mui/system';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Link,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useMounted } from '../../hooks/use-mounted';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { homeWebApi } from '../../api/home-web';
import { paths } from '../../paths';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { HomeWebListTable } from '../../sections/home-web/home-web-list-table';
import { HomeWebCreateModal } from '../../sections/layout-home-web/home-web-create-modal';
import toast from 'react-hot-toast';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      title: undefined,
      active: undefined,
    },
    page: 0,
    perPage: 25,
    sortBy: 'id',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useHomeWeb = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    homeWeb: [],
    homeWebCount: 0,
    loading: true,
  });

  const getHomeWebs = useCallback(async () => {
    try {
      const response = await homeWebApi.getAllHome(search);

      if (isMounted()) {
        setState({
          homeWeb: response.items,
          homeWebCount: response.pagination.totalItems,
          loading: false,
        });
      }
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      console.error(err);
    }
  }, [search, isMounted]);

  const handleRemove = useCallback(
    async (ids) => {
      for (const id of ids) {
        await homeWebApi.deleteHomeWeb(id);
        toast.success('Diseño de inicio eliminado con éxito');
      }
      getHomeWebs();
    },
    [getHomeWebs],
  );

  useEffect(
    () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      getHomeWebs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getHomeWebs,
    handleRemove,
  };
};

const useTableEvents = (updateSearch) => {
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

  return {
    handlePageChange,
    handlePerPageChange,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { search, updateSearch } = useSearch();
  const { homeWeb, homeWebCount, loading, handleRemove } = useHomeWeb(search);
  const { handlePageChange, handlePerPageChange } =
    useTableEvents(updateSearch);

  return (
    <>
      <Head>
        <title>Home | Listado</title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Container maxWidth={false}>
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="end"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h5">Listado de homes</Typography>
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
                      href={paths.homeWeb.index}
                      variant="subtitle2"
                    >
                      Homes
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Listado
                    </Typography>
                  </Breadcrumbs>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    color="black"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <FilterFunnel01 />
                      </SvgIcon>
                    }
                    variant="text"
                    disabled
                  >
                    Filtros
                  </Button>
                  <Button
                    startIcon={
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={() => setOpenCreateModal(true)}
                  >
                    Añadir
                  </Button>
                  <HomeWebCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <HomeWebListTable
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              layoutHomeWebs={homeWeb}
              layoutHomeWebsCount={homeWebCount}
              page={search.page}
              perPage={search.perPage}
              loading={loading}
              handleRemove={handleRemove}
            />
          </Container>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
