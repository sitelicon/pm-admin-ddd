import { useCallback, useEffect, useRef, useState } from 'react';
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
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { LayoutHomeWebListTable } from '../../sections/layout-home-web/layout-home-web-list-table';
import { LayoutHomeWebCreateModal } from '../../sections/layout-home-web/layout-home-web-create-modal';
import toast from 'react-hot-toast';
import MenuSettings from '../../sections/menu-settings/menu-settings';
import { useParams } from 'next/navigation';
import { Container } from '@mui/system';
import { useStores } from '../../hooks/use-stores';
import HomeSettings from '../../sections/home/home-settings';

const useLayoutHomeWebs = (id, selectedStore) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    layoutHomeWebs: [],
    layoutHomeWebsCount: 0,
    info: {},
    loading: true,
  });

  const getLayoutHomeWebs = useCallback(async () => {
    try {
      setState({
        layoutHomeWebs: [],
        layoutHomeWebsCount: 0,
        info: {},
        loading: true,
      });
      const response = await layoutHomeWebApi.getLayoutById(id, selectedStore);
      if (isMounted()) {
        setState({
          layoutHomeWebs: response.items,
          layoutHomeWebsCount: response.items.length,
          info: {
            id: response.info.id,
            store_id: selectedStore,
            title: response.info.title,
            active: response.info.active,
            from_date: response.info.from_date,
            to_date: response.info.to_date,
          },
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
  }, [id, selectedStore, isMounted]);

  useEffect(
    () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      getLayoutHomeWebs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, selectedStore],
  );

  return {
    ...state,
    getLayoutHomeWebs,
  };
};

const Page = () => {
  const stores = useStores();
  const [selectedStore, setSelectedStore] = useState(1);
  usePageView();
  const { id } = useParams();
  const rootRef = useRef(null);
  const {
    layoutHomeWebs,
    info,
    layoutHomeWebsCount,
    loading,
    getLayoutHomeWebs,
  } = useLayoutHomeWebs(id, selectedStore);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleRemove = async (ids) => {
    for (const id of ids) {
      await layoutHomeWebApi.deleteLayoutHomeWeb(id);
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
                    idHome={id}
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                  />
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <LayoutHomeWebListTable
              onPageChange={() => {}}
              onPerPageChange={() => {}}
              layoutHomeWebs={layoutHomeWebs}
              layoutHomeWebsCount={layoutHomeWebsCount}
              page={1}
              perPage={25}
              loading={loading}
              handleRemove={handleRemove}
            />
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={2}
              sx={{ p: 3 }}
            >
              <MenuSettings store={selectedStore} selectedHome={id} />
              <HomeSettings info={info} />
            </Stack>
            {/* PREVISUALIZER OF THIS */}
          </Container>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
