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
import { cartsApi } from '../../api/carts';
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
import { CartLines } from '../../sections/cart/cart-lines';
import { CartSummary } from '../../sections/cart/cart-summary';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(5, '0');
};

const useCart = (cartId) => {
  const [state, setState] = useState({
    cart: null,
    loading: true,
  });

  const getCart = useCallback(async (id) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const cart = await cartsApi.getCart(id);

      setState({
        cart,
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
    if (cartId) {
      getCart(cartId);
    }
  }, [cartId, getCart]);

  return state;
};

const Page = () => {
  const router = useRouter();
  const { cartId } = router.query;
  const { cart, loading } = useCart(cartId);

  usePageView();

  if (loading) {
    return null;
  }

  if (!cart) {
    return (
      <>
        <Head>
          <title>Carrito no encontrado</title>
        </Head>
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              <Typography variant="h4">Carrito no encontrado</Typography>
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  const createdAt = format(new Date(cart.created_at), 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

  return (
    <>
      <Head>
        <title>Carrito # {fillWithZeros(cart.id)} | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.carts.index}
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
                  Carritos abandonados
                </Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Carrito # {fillWithZeros(cart.id)}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  {/* <Typography color="text.secondary" variant="body2">
                    Para el pedido
                  </Typography>
                  <SvgIcon color="action">
                    <Package />
                  </SvgIcon>
                  <Link variant="body2" href={`/orders/${cart.order.id}`}>
                    {cart.order.order_number}
                  </Link> */}
                  <Typography color="text.secondary" variant="body2">
                    Creado el
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
            <CartSummary cart={cart} />
            <CartLines cart={cart} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
