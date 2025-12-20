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
import { instagramLayoutApi } from '../../../../api/instagram-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { OrderDrawer } from '../../../../sections/order/order-drawer';
import { OrderListContainer } from '../../../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { paths } from '../../../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { InstagramLayoutListTable } from '../../../../sections/instagram-layout/instagram-layout-list-table';
import { InstagramLayoutCreateModal } from '../../../../sections/instagram-layout/instagram-layout-create-modal';
import toast from 'react-hot-toast';
import { instagramLayoutItemApi } from '../../../../api/instagram-layout-item';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    perPage: 25,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useInstagramLayouts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    instagramLayouts: [],
    instagramLayoutsCount: 0,
    loading: true,
  });

  const getInstagramLayouts = useCallback(async () => {
    try {
      const response = await instagramLayoutApi.getInstagramLayouts(search);

      if (isMounted()) {
        setState({
          instagramLayouts: response.items,
          instagramLayoutsCount: response.pagination.totalItems,
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
      getInstagramLayouts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getInstagramLayouts,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const {
    instagramLayouts,
    instagramLayoutsCount,
    loading,
    getInstagramLayouts,
  } = useInstagramLayouts(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return instagramLayouts.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, instagramLayouts]);
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
      try {
        const response = await instagramLayoutItemApi.getInstagramLayoutItems({
          instagramId: id,
        });
        // Si tiene items, los elimino. Si no procedo.
        if (response.items) {
          for (const item of response.items) {
            await instagramLayoutItemApi.deleteInstagramLayoutItem(item.id);
          }
        }
        await instagramLayoutApi.deleteInstagramLayout(id).then(() => {
          toast.success('El grupo de instagram se ha eliminado');
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    getInstagramLayouts();
  };

  return (
    <>
      <Head>
        <title>Lista de diseño del control deslizante</title>
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
                  <Typography variant="h5">Lista de Instagrams</Typography>
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
                      href={paths.adminContent.home.instagram}
                      variant="subtitle2"
                    >
                      Instagrams
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
                    Crear Instagrams
                  </Button>
                  <InstagramLayoutCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <InstagramLayoutListTable
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              instagramLayouts={instagramLayouts}
              instagramLayoutsCount={instagramLayoutsCount}
              page={search.page}
              perPage={search.perPage}
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
