import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import { NotificationBox } from '@untitled-ui/icons-react';
import { paths } from '../../../paths';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { popupsApi } from '../../../api/popups';
import { PopupsDetails } from '../../../sections/popup/pop-details';
import { PopupImages } from '../../../sections/popup/pop-images';

const usePopUpItem = (id) => {
  const [state, setState] = useState({
    loading: true,
    item: null,
    error: null,
  });

  const getHelpCenterItem = useCallback(async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loading: true,
      }));

      const res = await popupsApi.getPopUp(id);

      setState({
        item: res[0],
        loading: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loading: false,
        error,
      }));
    }
  }, [id]);

  useEffect(() => {
    getHelpCenterItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: state.loading,
    item: state.item,
    error: state.error,
    refetch: getHelpCenterItem,
  };
};

const tenants = [
  { id: 1, label: '🇪🇸' },
  { id: 2, label: '🇬🇧' },
  { id: 3, label: '🇫🇷' },
  { id: 4, label: '🇵🇹' },
  { id: 5, label: '🇮🇹' },
  { id: 6, label: '🇩🇪' },
  { id: 7, label: '🇵🇹 - M' },
];

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, item, refetch, error } = usePopUpItem(id);
  const [currentTab, setCurrentTab] = useState('detalles');

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const tabs = useMemo(() => {
    return [
      {
        label: 'Detalles',
        value: 'detalles',
      },
      {
        label: 'Imágenes',
        value: 'imagenes',
      },
    ];
  }, []);

  if (loading) {
    return null;
  }

  if (error || !item) {
    return <h2>No se encuentra el item</h2>;
  }

  return (
    <>
      <Head>
        <title>Popup: {item.title || 'Cargando...'} | PACOMARTINEZ</title>
      </Head>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ pr: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: 'transparent',
                      borderRadius: 1,
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      height: 100,
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SvgIcon sx={{ fontSize: 50 }}>
                      <NotificationBox />
                    </SvgIcon>
                  </Box>
                </Box>
                <Stack spacing={1}>
                  <Typography variant="h5">
                    {
                      tenants.find((option) => {
                        return item.language_id === option.id;
                      }).label
                    }{' '}
                    {item.title}
                  </Typography>
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
                      href={paths.popups.index}
                      variant="subtitle2"
                    >
                      Popups
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Gestión
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">{tab.label}</Typography>
                        {!!tab.counter && (
                          <Chip
                            label={tab.counter}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                            }}
                          />
                        )}
                      </Stack>
                    }
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </Stack>
            {currentTab === 'detalles' && (
              <PopupsDetails item={item} refetch={refetch} />
            )}
            {currentTab === 'imagenes' && (
              <PopupImages item={item} refetch={refetch} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
