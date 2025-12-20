import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { customersApi } from '../../api/customers';

const useSearch = (id) => {
  const [state, setState] = useState({
    page: 1,
    perPage: 10,
    id: id,
  });

  const handlePageChange = (event, newPage) => {
    setState((state) => ({ ...state, page: newPage }));
  };

  const handlePerPageChange = (event) => {
    setState((state) => ({ ...state, perPage: event.target.value }));
  };

  return {
    page: state.page,
    perPage: state.perPage,
    id: state.id,
    handlePageChange,
    handlePerPageChange,
  };
};

const usePoints = (props) => {
  const { id, page, perPage } = props;
  const [state, setState] = useState({
    loading: false,
    error: null,
    movementsPoints: [],
  });

  const getMovementsPoints = async (id, page, perPage) => {
    try {
      setState((state) => ({ ...state, loading: true }));
      await customersApi
        .getMovementsPoints({
          customerId: id,
          perPage: perPage,
          page: page,
        })
        .then((response) => {
          setState((state) => ({ ...state, movementsPoints: response.data }));
        });
    } catch (err) {
      setState((state) => ({ ...state, error: err }));
    } finally {
      setState((state) => ({ ...state, loading: false }));
    }
  };

  useEffect(
    () => {
      getMovementsPoints(id, page, perPage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, page, perPage],
  );

  return {
    movementsPoints: state.movementsPoints,
    loading: state.loading,
    error: state.error,
  };
};

export const CustomerPoints = (props) => {
  const { customerId = 0, points, ...other } = props;
  const { page, perPage, id, handlePageChange, handlePerPageChange } =
    useSearch(customerId);

  const { movementsPoints, loading, error } = usePoints({ page, perPage, id });

  return (
    <Card {...other}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Movimientos de puntos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Actualmente posee {points} puntos.
        </Typography>
      </CardContent>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Pedido</TableCell>
              <TableCell align="center">Motivo</TableCell>
              <TableCell align="center">Acción</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">ICG Sync</TableCell>
              <TableCell align="center">Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !error && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2">Cargando...</Typography>
                </TableCell>
              </TableRow>
            )}
            {movementsPoints &&
              movementsPoints.map((point) => {
                const createdAt = format(
                  new Date(point.created_at),
                  'dd/MM/yyyy HH:mm:ss',
                  {
                    locale: es,
                  },
                );

                const isSync =
                  point.sincronized_at !== null &&
                  JSON.parse(point.response) !== null &&
                  JSON.parse(point.response).error === false ? (
                    <SeverityPill color="success">Si</SeverityPill>
                  ) : (
                    <SeverityPill color="warning">No</SeverityPill>
                  );

                return (
                  <TableRow key={point.id}>
                    <TableCell>
                      <Link href={`/orders/${point.order_id}`}>
                        {point.order_id}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{point.comment}</TableCell>
                    <TableCell align="center">{point.type}</TableCell>
                    <TableCell align="center">{point.reward_points}</TableCell>
                    <TableCell align="center">{isSync}</TableCell>
                    <TableCell align="center">{createdAt}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={movementsPoints.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

CustomerPoints.propTypes = {
  customerId: PropTypes.array,
  points: PropTypes.number,
};
