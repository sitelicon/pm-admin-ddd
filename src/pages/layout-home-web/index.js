import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { layoutHomeWebApi } from '../../api/layout-home-web';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { OrderDrawer } from '../../sections/order/order-drawer';
import { OrderListContainer } from '../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { FilterFunnel01, Globe04 } from '@untitled-ui/icons-react';
import { LayoutHomeWebListTable } from '../../sections/layout-home-web/layout-home-web-list-table';
import { LayoutHomeWebCreateModal } from '../../sections/layout-home-web/layout-home-web-create-modal';
import toast from 'react-hot-toast';
import { useStores } from '../../hooks/use-stores';
import MenuSettings from '../../sections/menu-settings/menu-settings';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    perPage: 25,
    sortBy: 'position',
    sortDir: 'ASC',
    storeId: 1,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useLayoutHomeWebs = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    layoutHomeWebs: [],
    layoutHomeWebsCount: 0,
    loading: true,
  });

  const getLayoutHomeWebs = useCallback(async () => {
    try {
      const response = await layoutHomeWebApi.getLayoutHomeWebs(search);

      if (isMounted()) {
        setState({
          layoutHomeWebs: response.items,
          layoutHomeWebsCount: response.pagination.totalItems,
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

  useEffect(
    () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      getLayoutHomeWebs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getLayoutHomeWebs,
  };
};

const Page = () => {
  const stores = useStores();
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const [selectedStore, setSelectedStore] = useState(1);
  const { layoutHomeWebs, layoutHomeWebsCount, loading, getLayoutHomeWebs } =
    useLayoutHomeWebs(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return layoutHomeWebs.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, layoutHomeWebs]);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  usePageView();

  useEffect(() => {
    if (selectedStore) {
      updateSearch((prevState) => ({
        ...prevState,
        storeId: selectedStore,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

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

  const handleOrderClose = useCallback(() => {
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, []);

  const handleEsc = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        handleOrderClose();
      }
    },
    [handleOrderClose],
  );

  useEffect(() => {
    if (drawer.isOpen) {
      // Add listener to ESC key to close drawer
      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [drawer.isOpen, handleEsc]);

  const handleRemove = async (ids) => {
    for (const id of ids) {
      const response = await layoutHomeWebApi.deleteLayoutHomeWeb(id);
      toast.success('Diseño de inicio eliminado con éxito');
    }
    getLayoutHomeWebs();
  };

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
          <OrderListContainer open={drawer.isOpen}>
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="end"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h5">Listado</Typography>
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
                      href={paths.layoutHomeWeb.index}
                      variant="subtitle2"
                    >
                      Maquetación Web
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Listado
                    </Typography>
                  </Breadcrumbs>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Select
                    native
                    variant="standard"
                    value={selectedStore}
                    onChange={(event) => setSelectedStore(event.target.value)}
                  >
                    {stores.map((language) => {
                      return (
                        <option key={language.id} value={language.id}>
                          {language.name}
                        </option>
                      );
                    })}
                  </Select>
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
                  <LayoutHomeWebCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <LayoutHomeWebListTable
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              layoutHomeWebs={layoutHomeWebs}
              layoutHomeWebsCount={layoutHomeWebsCount}
              page={search.page}
              perPage={search.perPage}
              loading={loading}
              handleRemove={handleRemove}
            />
            <MenuSettings store={selectedStore} />
          </OrderListContainer>
          <OrderDrawer
            container={rootRef.current}
            onClose={handleOrderClose}
            open={drawer.isOpen}
            order={currentLayout}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
