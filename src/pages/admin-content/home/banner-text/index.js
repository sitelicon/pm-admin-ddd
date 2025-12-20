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
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { bannerTextLayoutApi } from '../../../../api/banner-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { OrderDrawer } from '../../../../sections/order/order-drawer';
import { OrderListContainer } from '../../../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { paths } from '../../../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { BannerLayoutListTable } from '../../../../sections/banner-layout/banner-layout-list-table';
import { BannerLayoutCreateModal } from '../../../../sections/banner-layout/banner-layout-create-modal';
import toast from 'react-hot-toast';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    rowsPerPage: 25,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useBannerTextLayouts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    bannerTextLayouts: [],
    bannerTextLayoutsCount: 0,
    loading: true,
  });

  const getBannerTextLayouts = useCallback(async () => {
    try {
      const response = await bannerTextLayoutApi.getBannerTextLayouts(search);

      if (isMounted()) {
        setState({
          bannerTextLayouts: response.items,
          bannerTextLayoutsCount: response.pagination.totalItems,
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
      getBannerTextLayouts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getBannerTextLayouts,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const {
    bannerTextLayouts,
    bannerTextLayoutsCount,
    loading,
    getBannerTextLayouts,
  } = useBannerTextLayouts(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return bannerTextLayouts.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, bannerTextLayouts]);
  const [openCreateModal, setOpenCreateModal] = useState(false);

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

  const handleRowsPerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
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

  //prettier-ignore
  const handleRemove = async (bannerIds) => {
    try {
      await bannerTextLayoutApi.deleteSelectedBannerTextLayouts(bannerIds);
      toast.success('El banner se eliminó correctamente');
      getBannerTextLayouts();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar el banner');
    }
  };

  return (
    <>
      <Head>
        <title>Lista de banners</title>
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
                  <Typography variant="h5">Lista de Banner Text</Typography>
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
                      href={paths.adminContent.home.bannerText}
                      variant="subtitle2"
                    >
                      Banner Text
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
                    Crear Banner Text
                  </Button>
                  <BannerLayoutCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <BannerLayoutListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              bannerTextLayouts={bannerTextLayouts}
              bannerTextLayoutsCount={bannerTextLayoutsCount}
              page={search.page}
              rowsPerPage={search.rowsPerPage}
              loading={loading}
              handleRemove={handleRemove}
            />
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
