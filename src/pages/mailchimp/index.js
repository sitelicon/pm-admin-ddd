import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { CampaignsListTable } from '../../sections/mailchimp/campaigns-list-table';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { mailchimpApi } from '../../api/mailchimp';

const useSearch = () => {
  const [search, setSearch] = useLocalStorage('colorListSearch', {
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useCampaings = (search) => {
  const [state, setState] = useState({
    campaings: [],
    campaingsCount: 0,
    loading: true,
  });

  const getCampaings = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await mailchimpApi.getCampaings(search);
      setState({
        campaings: response.campaigns,
        campaingsCount: response.total_items,
        loading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }, [search]);

  useEffect(() => {
    getCampaings(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    campaings: state.campaings,
    campaingsCount: state.campaingsCount,
    loading: state.loading,
  };
};

const columns = [
  {
    id: 0,
    label: 'Mailchimp ID',
    value: 'mail-id',
    align: 'center',
  },
  {
    id: 1,
    label: 'Nombre de lista',
    value: 'list_name',
    align: 'center',
  },
  {
    id: 2,
    label: 'Emails enviados',
    value: 'emails_sent',
    align: 'left',
  },
  {
    id: 3,
    label: 'Apertura',
    value: 'open_rate',
    align: 'left',
  },
  {
    id: 4,
    label: 'Clicks',
    value: 'click_rate',
    align: 'left',
  },
  {
    id: 5,
    label: 'Fecha de creación',
    value: 'create_time',
    align: 'left',
  },
  {
    id: 6,
    label: 'Estado',
    value: 'status',
    align: 'center',
  },
  {
    id: 6,
    label: 'Acciones',
    value: 'actions',
    align: 'center',
  },
];

const MailChimpList = () => {
  const { search, updateSearch } = useSearch();
  const { campaings, campaingsCount, loading } = useCampaings(search);
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

  return (
    <>
      <Head>
        <title>Mailchimp | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Mailchimp</Typography>
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
                    href={paths.colors.index}
                    variant="subtitle2"
                  >
                    Campañas
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  onClick={() => setOpenCreateModal(true)}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Crear campaña
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <CampaignsListTable
                columns={columns}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                campaigns={campaings}
                campaignsCount={campaingsCount}
                perPage={search.perPage}
                loading={loading}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

MailChimpList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MailChimpList;
