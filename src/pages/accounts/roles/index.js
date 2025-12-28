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
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { usersApi } from '../../../api/users';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { paths } from '../../../paths';
import { RoleListTable } from '../../../sections/role/role-list-table';
import { RoleCreateModal } from '../../../sections/role/role-create-modal';
import toast from 'react-hot-toast';

const useAccountRoles = () => {
  const [state, setState] = useState({
    roles: [],
    loading: false,
  });

  const getRoles = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await usersApi.getRoles();
      setState((prevState) => ({ ...prevState, roles: response.items }));
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar los roles.');
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return { ...state, refetch: () => getRoles() };
};

const Page = () => {
  const { roles, loading, refetch } = useAccountRoles();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  usePageView();

  return (
    <>
      <Head>
        <title>Listado de roles | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de roles</Typography>
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
                    href={paths.accounts}
                    variant="subtitle2"
                  >
                    Gestión de roles
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Crear rol
                </Button>
                <RoleCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                  onConfirm={refetch}
                />
              </Stack>
            </Stack>
            <Card>
              <RoleListTable loading={loading} roles={roles} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
