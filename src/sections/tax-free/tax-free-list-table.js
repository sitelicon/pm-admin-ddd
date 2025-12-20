import { useCallback, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Checkbox,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { format } from 'date-fns';
import { Package } from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { ordersApi } from '../../api/orders';
import toast from 'react-hot-toast';

const returnStatus = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  declined: 'Denegado',
};

const documentType = {
  passport: 'Pasaporte',
  consular: 'Carta de Identificación consular',
  residence: 'Tarjeta de residencia',
};

const returnStatusColor = {
  approved: 'success',
  pending: 'warning',
  declined: 'error',
};

const TaxFreeListItem = ({
  request,
  selectAll,
  selected,
  selectOne,
  deselectOne,
  refetch,
}) => {
  const [status, setStatus] = useState(request.status);

  const availableSave = useMemo(() => {
    return status !== request.status;
  }, [status, request.status]);

  const handleSaveNewStatus = useCallback(async () => {
    try {
      await ordersApi
        .updateTaxFreeRequestStatus(request.id, status)
        .then(() => {
          toast.success('Solicitudes actualizada correctamente');
          refetch();
        });
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la solicitud');
    }
  }, [request.id, status, refetch]);

  return (
    <TableRow key={request.id} hover>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected.includes(request.id)}
          onChange={(event) => {
            const { checked } = event.target;

            if (checked) {
              selectOne(request.id);
            } else {
              deselectOne(request.id);
            }
          }}
          value={selected.includes(request.id)}
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <SvgIcon color="action" fontSize="small">
            <Package />
          </SvgIcon>
          <Link
            color="primary"
            component={NextLink}
            href={`/orders/${request.order.id}`}
          >
            {request.order.order_number}
          </Link>
        </Stack>
      </TableCell>
      {/* <TableCell>
        <Stack spacing={1}>
          <Link
            color="inherit"
            component={NextLink}
            href={`/customers/${request.customer.id}`}
            variant="subtitle2"
          >
            {request.customer.name} {request.customer.last_name}
          </Link>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: '0 !important' }}
          >
            {request.customer.email}
          </Typography>
        </Stack>
      </TableCell> */}
      <TableCell>{request.order.tax_free_name}</TableCell>
      <TableCell>
        {documentType[request.order.tax_free_type_document]}
      </TableCell>
      <TableCell>
        {request.order.tax_free_nationality ?? 'Desconocida'}
      </TableCell>
      <TableCell>{request.order.passport}</TableCell>
      <TableCell>{request.order.tax_free_billing_address}</TableCell>
      <TableCell>
        {format(new Date(request.order.tax_free_birthday), 'dd/MM/yyyy', {
          locale: es,
        })}
      </TableCell>
      <TableCell>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Estado"
          onChange={(event) => setStatus(event.target.value)}
        >
          {Object.keys(returnStatus).map((key) => (
            <MenuItem key={key} value={key}>
              {returnStatus[key]}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell>
        {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', {
          locale: es,
        })}
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          onClick={handleSaveNewStatus}
          disabled={!availableSave}
        >
          Guardar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const TaxFreeListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  requests,
  requestsCount,
  perPage,
  loading,
  columns,
  refetch,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(requests);

  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const selectedAll = selected.length === requests.length;
  const selectedSome = selected.length > 0 && selected.length < requests.length;

  return (
    <div {...other}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Pedido</TableCell>
              {/* <TableCell>Cliente</TableCell> */}
              <TableCell>Nombre y apellidos</TableCell>
              <TableCell>Tipo de documento</TableCell>
              <TableCell>Nacionalidad</TableCell>
              <TableCell>Nº Documento</TableCell>
              <TableCell>Dirección de facturación</TableCell>
              <TableCell>Fecha cumpleaños</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  {Array.from(Array(6)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 1 && (
                        <Skeleton
                          variant="text"
                          width={100}
                          sx={{
                            marginTop: 1,
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              requests.map((request, index) => (
                <TaxFreeListItem
                  key={index}
                  request={request}
                  selectAll={selectAll}
                  selectOne={selectOne}
                  selected={selected}
                  deselectAll={deselectAll}
                  deselectOne={deselectOne}
                  refetch={refetch}
                />
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={requestsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Solicitudes por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};
