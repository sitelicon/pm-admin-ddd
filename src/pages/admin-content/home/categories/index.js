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
import { categoryLayoutApi } from '../../../../api/category-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { OrderDrawer } from '../../../../sections/order/order-drawer';
import { OrderListContainer } from '../../../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { paths } from '../../../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { CategoryLayoutListTable } from '../../../../sections/category-layout/category-layout-list-table';
import { CategoryLayoutCreateModal } from '../../../../sections/category-layout/category-layout-create-modal';
import toast from 'react-hot-toast';
import { categoryLayoutItemApi } from '../../../../api/category-layout-item';

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

const useCategoryLayouts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    categoryLayouts: [],
    categoryLayoutsCount: 0,
    loading: true,
  });

  const getCategoryLayouts = useCallback(async () => {
    try {
      const response = await categoryLayoutApi.getCategoryLayouts(search);

      if (isMounted()) {
        setState({
          categoryLayouts: response.items,
          categoryLayoutsCount: response.pagination.totalItems,
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
      getCategoryLayouts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getCategoryLayouts,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const { categoryLayouts, categoryLayoutsCount, loading, getCategoryLayouts } =
    useCategoryLayouts(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return categoryLayouts.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, categoryLayouts]);
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
        const response = await categoryLayoutItemApi.getCategoryLayoutItems({
          categoryId: id,
        });
        // Si tiene items, los elimino. Si no procedo.
        if (response.items) {
          for (const item of response.items) {
            await categoryLayoutItemApi.deleteCategoryLayoutItem(item.id);
          }
        }
        await categoryLayoutApi.deleteCategoryLayout(id).then(() => {
          toast.success('El layout se eliminó correctamente');
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    getCategoryLayouts();
  };

  return (
    <>
      <Head>
        <title>Lista de categorias</title>
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
                  <Typography variant="h5">Lista de categorias</Typography>
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
                      href={paths.adminContent.home.categories}
                      variant="subtitle2"
                    >
                      Categorias
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
                    Crear Categorias
                  </Button>
                  <CategoryLayoutCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <CategoryLayoutListTable
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              categoryLayouts={categoryLayouts}
              categoryLayoutsCount={categoryLayoutsCount}
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
