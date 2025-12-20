import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import numeral from 'numeral';
import {
  Card,
  CardHeader,
  SvgIcon,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Tooltip,
  Link,
  Typography,
} from '@mui/material';
import {
  Building02,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  Package,
  PackageCheck,
  PackageX,
  ShoppingBag01,
  Truck01,
  Download02,
} from '@untitled-ui/icons-react';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { ordersApi } from '../../api/orders';
import { toast } from 'react-hot-toast';

const statusMap = {
  pending: 'gray',
  payment_failed: 'error',
  under_packaging: 'warning',
  packaged: 'info',
  customer_shipped: 'info',
  shop_shipped: 'info',
  shop_received: 'info',
  delivered: 'success',
  canceled: 'error',
  refund_request: 'warning',
  refunded: 'success',
  refunded_multibank: 'success',
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', icon: <Clock /> };
    case 'payment_failed':
      return { label: 'Pago fallido', icon: <CreditCardX /> };
    case 'under_packaging':
      return { label: 'En preparación', icon: <ShoppingBag01 /> };
    case 'packaged':
      return { label: 'Preparado', icon: <Package /> };
    case 'customer_shipped':
      return { label: 'Enviado', icon: <Truck01 /> };
    case 'shop_shipped':
      return { label: 'En camino', icon: <Truck01 /> };
    case 'shop_received':
      return { label: 'En tienda', icon: <Building02 /> };
    case 'delivered':
      return { label: 'Entregado', icon: <PackageCheck /> };
    case 'canceled':
      return { label: 'Cancelado', icon: <PackageX /> };
    case 'refund_request':
      return { label: 'Devolución', icon: <FlipBackward /> };
    case 'refunded':
      return { label: 'Abonado', icon: <CreditCardCheck /> };
    case 'refunded_multibank':
      return { label: 'Abonado Multibanco', icon: <CreditCardCheck /> };
    default:
      return status;
  }
};

const useInvoices = (customerId) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await ordersApi.getOrderWithInvoices(customerId);
        setInvoices(response);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      }
    };

    fetchInvoices();
  }, [customerId]);

  return {
    invoices,
  };
};

const ItemList = (props) => {
  const { invoice } = props;
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const status = getStatusLabel(invoice.state);
  const statusColor = statusMap[invoice.state] || 'warning';

  const getOrderInfo = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoadingInvoice(true);
        const response = await ordersApi.getOrderInvoice(invoice.id);
        const blob = new Blob([Buffer.from(response.data, 'base64')], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `INVOICE-${invoice.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Factura descargada');
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo descargar la factura: ${error.message}`);
      } finally {
        setLoadingInvoice(false);
      }
    },
    [invoice.id],
  );

  return (
    <TableRow key={invoice.id}>
      <TableCell>
        <Link component={NextLink} href={`/orders/${invoice.id}`}>
          {invoice.order_number}
        </Link>
      </TableCell>
      <TableCell>
        <Tooltip
          placement="top"
          title={format(new Date(invoice.created_at), 'P HH:mm:ss', {
            locale: es,
          })}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" whiteSpace="nowrap">
              {format(new Date(invoice.created_at), 'dd MMMM, yyyy', {
                locale: es,
              })}{' '}
              a las{' '}
              {format(new Date(invoice.created_at), 'HH:mm', {
                locale: es,
              })}
            </Typography>
          </Stack>
        </Tooltip>
      </TableCell>
      <TableCell>
        <SeverityPill color={statusColor}>
          <SvgIcon fontSize="small" color="inherit" sx={{ mr: 0.5 }}>
            {status.icon}
          </SvgIcon>{' '}
          {status.label}
        </SeverityPill>
      </TableCell>
      <TableCell>
        {invoice.store ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">{invoice.store.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {invoice.store.code.toUpperCase()}
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="caption">
            N/A
          </Typography>
        )}
      </TableCell>
      <TableCell>{numeral(invoice.grand_total).format('$0,0.00')}</TableCell>
      <TableCell align="center">
        <Tooltip
          arrow
          placement="top"
          title={
            invoice?.order_status_id < 3
              ? 'No se puede descargar la factura hasta que el pedido esté en estado "En preparación"'
              : ''
          }
        >
          <span>
            <Button
              variant="contained"
              startIcon={
                <SvgIcon fontSize="small">
                  <Download02 />
                </SvgIcon>
              }
              onClick={getOrderInfo}
              disabled={
                loadingInvoice || !invoice || invoice?.order_status_id < 3
              }
            >
              {loadingInvoice ? 'Descargando factura…' : 'Descargar factura'}
            </Button>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export const CustomerInvoices = (props) => {
  const { customerId, ...other } = props;
  const { invoices } = useInvoices(customerId);

  return (
    <Card {...other}>
      <CardHeader action={<MoreMenu />} title="Facturas solicitadas" />
      <Scrollbar>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell align="center">Descargar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => {
              return <ItemList key={invoice.id} invoice={invoice} />;
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={invoices.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Card>
  );
};

CustomerInvoices.propTypes = {
  invoices: PropTypes.array,
};
