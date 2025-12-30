import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ArrowLeft, Lock01 } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { usersApi } from '../../../api/users';
import { RoleEditForm } from '../../../sections/role/role-edit-form';

const useRole = (roleId) => {
  const [state, setState] = useState({
    role: undefined,
    loading: true,
  });

  const getRole = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await usersApi.getRole(roleId);
      setState((prevState) => ({
        ...prevState,
        role: response,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [roleId]);

  useEffect(() => {
    getRole();
  }, [getRole]);

  return {
    ...state,
    refetch: () => getRole(),
  };
};

const Page = () => {
  const router = useRouter();
  const { roleId } = router.query;
  const { role, loading, refetch } = useRole(roleId);
  const [name, setName] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
    }
  }, [role]);

  if (!loading && !role) {
    return (
      <Stack
        spacing={2}
        sx={{
          py: 10,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <SvgIcon sx={{ fontSize: 60 }}>
          <Lock01 />
        </SvgIcon>

        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            ¡Ups!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            No hemos encontrado el rol solicitado.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push(paths.accounts.roles.index)}
          >
            Volver a la lista de roles
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <>
      <Head>
        <title>Detalles del rol | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={2}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.accounts.roles.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeft />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    Volver al listado de roles
                  </Typography>
                </Link>
              </div>
              <Stack spacing={1}>
                <Typography variant="h5">Rol: {name}</Typography>
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
                    href={paths.accounts.roles.index}
                    variant="subtitle2"
                  >
                    Gestión de roles
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Editar rol
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <RoleEditForm role={role} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
