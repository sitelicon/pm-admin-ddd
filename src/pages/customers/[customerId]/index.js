import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { es } from 'date-fns/locale';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { customersApi } from '../../../api/customers';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { CustomerBasicDetails } from '../../../sections/customer/customer-basic-details';
import { CustomerDataManagement } from '../../../sections/customer/customer-data-management';
import { CustomerEmailsSummary } from '../../../sections/customer/customer-emails-summary';
import { CustomerInvoices } from '../../../sections/customer/customer-invoices';
import { CustomerPayment } from '../../../sections/customer/customer-payment';
import { CustomerPoints } from '../../../sections/customer/customer-points';
import { CustomerLogs } from '../../../sections/customer/customer-logs';
import { getInitials } from '../../../utils/get-initials';
import { CustomerWishlists } from '../../../sections/customer/customer-wishlists';
import { CustomerCarts } from '../../../sections/customer/customer-carts';
import { CustomerOrders } from '../../../sections/customer/customer-orders';
import { CustomerReturns } from '../../../sections/customer/customer-returns';
import { SeverityPill } from '../../../components/severity-pill';

const tabs = [
  { label: 'Detalles', value: 'details' },
  { label: 'Carritos', value: 'carts' },
  { label: 'Lista de deseos', value: 'wishlist' },
  { label: 'Pedidos', value: 'orders' },
  { label: 'Devoluciones', value: 'returns' },
  { label: 'Facturas', value: 'invoices' },
  { label: 'Logs', value: 'logs' },
  { label: 'Puntos', value: 'points' },
];

const useCustomer = (id) => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async (customerId) => {
    try {
      setLoading(true);
      const response = await customersApi.getCustomerById(customerId);
      setCustomer(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    () => {
      if (id) {
        getCustomer(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  return { customer, loading, refetch: () => getCustomer(id) };
};

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  const getInvoices = useCallback(async () => {
    try {
      const response = await customersApi.getInvoices();
      setInvoices(response);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(
    () => {
      getInvoices();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return invoices;
};

const useLogs = () => {
  const [logs, setLogs] = useState([]);

  const getLogs = useCallback(async () => {
    try {
      const response = await customersApi.getLogs();
      setLogs(response);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(
    () => {
      getLogs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return logs;
};

const Page = () => {
  const router = useRouter();
  const { customerId } = router.query;
  const [currentTab, setCurrentTab] = useState('details');
  const { customer, refetch } = useCustomer(customerId);
  const invoices = useInvoices();
  const logs = useLogs();

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  if (!customer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Detalles de cliente | PACOMARTINEZ</title>
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
            <Stack spacing={2}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.customers.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    Volver al listado de clientes
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    src={customer.avatar}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  >
                    {getInitials(`${customer.name} ${customer.last_name}`)}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{customer.email}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">
                        ID de usuario:
                      </Typography>
                      <Chip label={customer.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
                {customer.deleted_at && (
                  <Stack alignItems="center">
                    <SeverityPill color="error">
                      <Typography variant="body">
                        Cliente eliminado el{' '}
                        {customer.deleted_at
                          ? format(new Date(customer.deleted_at), 'P', {
                              locale: es,
                            })
                          : 'Desconocido'}
                      </Typography>
                    </SeverityPill>
                  </Stack>
                )}
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 1 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === 'details' && (
              <div>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6} lg={8}>
                      <CustomerBasicDetails customer={customer} />
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                      <CustomerDataManagement
                        customer={customer}
                        refetch={refetch}
                      />
                    </Grid>
                  </Grid>
                  {/* <CustomerPayment /> */}
                  {/* <CustomerEmailsSummary /> */}
                </Stack>
              </div>
            )}
            {currentTab === 'carts' && <CustomerCarts carts={customer.carts} />}
            {currentTab === 'wishlist' && (
              <CustomerWishlists wishlists={customer.wishlists} />
            )}
            {currentTab === 'orders' && (
              <CustomerOrders customerId={customer.id} />
            )}
            {currentTab === 'returns' && (
              <CustomerReturns customerId={customer.id} />
            )}
            {currentTab === 'invoices' && (
              <CustomerInvoices customerId={customer.id} />
            )}
            {currentTab === 'logs' && <CustomerLogs logs={logs} />}
            {currentTab === 'points' && (
              <CustomerPoints
                customerId={customer.id}
                points={customer.reward_points}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
