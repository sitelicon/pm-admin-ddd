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
import { blogLayoutApi } from '../../../../api/blog-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { OrderDrawer } from '../../../../sections/order/order-drawer';
import { OrderListContainer } from '../../../../sections/order/order-list-container';
import { BreadcrumbsSeparator } from '../../../../components/breadcrumbs-separator';
import { paths } from '../../../../paths';
import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { BlogLayoutListTable } from '../../../../sections/blog-layout/blog-layout-list-table';
import { BlogLayoutCreateModal } from '../../../../sections/blog-layout/blog-layout-create-modal';
import toast from 'react-hot-toast';
import { blogLayoutItemApi } from '../../../../api/blog-layout-item';

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

const useBlogLayouts = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    blogLayouts: [],
    blogLayoutsCount: 0,
    loading: true,
  });

  const getBlogLayouts = useCallback(async () => {
    try {
      const response = await blogLayoutApi.getBlogLayouts(search);

      if (isMounted()) {
        setState({
          blogLayouts: response.items,
          blogLayoutsCount: response.pagination.totalItems,
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
      getBlogLayouts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    ...state,
    getBlogLayouts,
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const { blogLayouts, blogLayoutsCount, loading, getBlogLayouts } =
    useBlogLayouts(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentLayout = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return blogLayouts.find((layoutWeb) => layoutWeb.id === drawer.data);
  }, [drawer, blogLayouts]);
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
        const response = await blogLayoutItemApi.getBlogLayoutItems({
          blogId: id,
        });
        // Si tiene items, los elimino. Si no procedo.
        if (response.items) {
          for (const item of response.items) {
            await blogLayoutItemApi.deleteBlogLayoutItem(item.id);
          }
        }
        await blogLayoutApi.deleteBlogLayout(id).then(() => {
          toast.success('El grupo de blogs se ha eliminado');
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    getBlogLayouts();
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
                  <Typography variant="h5">Lista de Blogs</Typography>
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
                      href={paths.adminContent.home.blogs}
                      variant="subtitle2"
                    >
                      Blogs
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
                    Crear Blogs
                  </Button>
                  <BlogLayoutCreateModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <BlogLayoutListTable
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              blogLayouts={blogLayouts}
              blogLayoutsCount={blogLayoutsCount}
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
