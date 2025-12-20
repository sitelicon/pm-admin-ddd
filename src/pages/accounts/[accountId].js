import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ArrowLeft } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useLanguageId } from '../../hooks/use-language-id';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { usersApi } from '../../api/users';
import { AccountEditForm } from '../../sections/account/account-edit-form';

const useAccount = (accountId) => {
  const [state, setState] = useState({
    account: undefined,
    loading: true,
  });

  const getAccount = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await usersApi.getUser(accountId);
      setState((prevState) => ({
        ...prevState,
        account: response,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [accountId]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  return {
    ...state,
    refetch: () => getAccount(),
  };
};

const Page = () => {
  const router = useRouter();
  const { accountId } = router.query;
  const { account, loading, refetch } = useAccount(accountId);
  const [name, setName] = useState('');

  useEffect(() => {
    if (account) {
      setName(account.name);
    }
  }, [account]);

  return (
    <>
      <Head>
        <title>Detalles de la cuenta | PACOMARTINEZ</title>
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
                  href={paths.accounts.list.index}
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
                    Volver al listado de cuentas
                  </Typography>
                </Link>
              </div>
              <Stack spacing={1}>
                <Typography variant="h5">Cuenta: {name}</Typography>
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
                    href={paths.accounts.list.index}
                    variant="subtitle2"
                  >
                    Gestión de cuentas
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Editar cuenta
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <AccountEditForm account={account} refetch={refetch} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
