import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { shipmentsApi } from '../../api/shipments';
import {
  ArrowLeft,
  Calendar,
  LinkBroken01,
  LinkBroken02,
  Package,
} from '@untitled-ui/icons-react';
import { paths } from '../../paths';
import { usePageView } from '../../hooks/use-page-view';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { order } from '../../api/orders/data';
import { SeverityPill } from '../../components/severity-pill';
import { Scrollbar } from '../../components/scrollbar';
import { ChatMessage } from '../../sections/chat/chat-message';
import { ChatMessageAdd } from '../../sections/chat/chat-message-add';
import { ShipmentLines } from '../../sections/shipment/shipment-lines';
import { ShipmentSummary } from '../../sections/shipment/shipment-summary';
import { customersApi } from '../../api/customers';
import { OrderExpeditions } from '../../sections/order/order-expeditions';

const useShipment = (shipmentId) => {
  const [state, setState] = useState({
    shipment: null,
    loading: true,
  });

  const getShipment = useCallback(async (id) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const shipment = await shipmentsApi.getShipment(id);

      setState({
        shipment,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (shipmentId) {
      getShipment(shipmentId);
    }
  }, [shipmentId, getShipment]);

  return state;
};

const Page = () => {
  const router = useRouter();
  const { shipmentId } = router.query;
  const { shipment, loading } = useShipment(shipmentId);

  usePageView();

  if (loading) {
    return null;
  }

  if (!shipment) {
    return (
      <>
        <Head>
          <title>Envío no encontrado</title>
        </Head>
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              <Typography variant="h4">Envío no encontrado</Typography>
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  const createdAt = format(new Date(shipment.created_at), 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

  return (
    <>
      <Head>
        <title>Envío # {shipment.number} | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.shipments.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeft />
                </SvgIcon>
                <Typography variant="subtitle2">Envíos</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">Envío # {shipment.number}</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography color="text.secondary" variant="body2">
                    Para el pedido
                  </Typography>
                  <SvgIcon color="action">
                    <Package />
                  </SvgIcon>
                  <Link variant="body2" href={`/orders/${shipment.order.id}`}>
                    {shipment.order.order_number}
                  </Link>
                  <Typography color="text.secondary" variant="body2">
                    , el
                  </Typography>
                  <SvgIcon color="action">
                    <Calendar />
                  </SvgIcon>
                  <Typography color="text.secondary" variant="body2">
                    {createdAt}
                  </Typography>
                </Stack>
              </Stack>
            </div>
            <ShipmentSummary shipment={shipment} />
            <OrderExpeditions order={shipment.order} />
            <ShipmentLines shipment={shipment} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
