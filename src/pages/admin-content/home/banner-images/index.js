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
import { bannerImageLayoutApi } from '../../../../api/banner-image-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { OrderDrawer } from '../../../../sections/order/order-drawer';
import { OrderListContainer } from '../../../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { paths } from '../../../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { BannerImageLayoutListTable } from '../../../../sections/banner-image-layout/banner-image-layout-list-table';
import { BannerImageLayoutCreateModal } from '../../../../sections/banner-image-layout/banner-image-layout-create-modal';
import toast from 'react-hot-toast';
import { bannerImageLayoutItemApi } from '../../../../api/banner-image-layout-item';

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

const useBannerImageLayouts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    bannerImageLayouts: [],
    bannerImageLayoutsCount: 0,
    loading: true,
  });

  const getBannerImageLayouts = useCallback(async () => {
    try {
      const response = await bannerImageLayoutApi.getBannerImageLayouts(search);

      if (isMounted()) {
        setState({
          bannerImageLayouts: response.items,
          bannerImageLayoutsCount: response.pagination.totalItems,
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
      getBannerImageLayouts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getBannerImageLayouts,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const {
    bannerImageLayouts,
    bannerImageLayoutsCount,
    loading,
    getBannerImageLayouts,
  } = useBannerImageLayouts(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return bannerImageLayouts.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, bannerImageLayouts]);
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

  const handleRemove = async (ids) => {
    for (const id of ids) {
      try {
        const response =
          await bannerImageLayoutItemApi.getBannerImageLayoutItems({
            bannerImageLayoutId: id,
          });
        // Si tiene items, los elimino. Si no procedo.
        if (response.items) {
          for (const item of response.items) {
            await bannerImageLayoutItemApi.deleteBannerImageLayoutItem(item.id);
          }
        }
        await bannerImageLayoutApi.deleteBannerImageLayout(id).then(() => {
          toast.success('El banner se eliminó correctamente');
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    getBannerImageLayouts();
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
                  <Typography variant="h5">Lista de Banner Images</Typography>
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
                      href={paths.adminContent.home.bannerImages}
                      variant="subtitle2"
                    >
                      Banner Images
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
                    Crear Banner Image
                  </Button>
                  <BannerImageLayoutCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <BannerImageLayoutListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              bannerImageLayouts={bannerImageLayouts}
              bannerImageLayoutsCount={bannerImageLayoutsCount}
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
