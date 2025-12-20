import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useLanguages } from '../../hooks/use-languages';
import { useLocalStorage } from '@uidotdev/usehooks';
import { CreateEditPopupModal } from '../../sections/popup/create-modal.js';
import { popupsApi } from '../../api/popups/index.js';
import { PopUpList } from '../../sections/popup/list-popups.js';

const usePopUps = (lang) => {
  const [state, setState] = useState({
    loading: true,
    items: [],
    itemsCount: 0,
    error: undefined,
  });

  const getPopups = useCallback(async (lang) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        items: [],
      }));
      const response = await popupsApi.getPopUps(lang);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        items: response,
        itemsCount: response.length,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      getPopups(lang);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );

  return {
    loading: state.loading,
    items: state.items,
    itemsCount: state.itemsCount,
    error: state.error,
    refetch: getPopups,
  };
};

const PopUp = () => {
  const languages = useLanguages();
  const [lang, setLang] = useLocalStorage('popUpLang', languages[0]?.id);
  const { loading, items, itemsCount, refetch } = usePopUps(lang);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  return (
    <>
      <Head>
        <title>Popups | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Popups</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.popups.index}
                  variant="subtitle2"
                >
                  Inicio · Popups · Listado
                </Link>
              </Breadcrumbs>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Select
                value={lang}
                label="Tienda"
                onChange={(event) => {
                  setLang(event.target.value);
                }}
              >
                {languages.map((language) => (
                  <MenuItem value={language.id} key={language.id}>
                    {language.language}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenCreateModal(true);
                }}
              >
                Añadir popup
              </Button>
              <CreateEditPopupModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
              />
            </Stack>
          </Stack>
        </Box>
        <PopUpList
          items={items}
          itemsCount={itemsCount}
          loading={loading}
          refetch={refetch}
        />
      </Box>
    </>
  );
};

PopUp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PopUp;
