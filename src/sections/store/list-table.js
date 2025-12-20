import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { paths } from '../../paths';
import { getInitials } from '../../utils/get-initials';
import { getLangFlag, getLangTitle } from '../../utils/get-lang-flag';
import { format } from 'date-fns';
import { Email, Phone } from '@mui/icons-material';
import { es } from 'date-fns/locale';
import { SeverityPill } from '../../components/severity-pill';
import { pickupStoresApi } from '../../api/pickup-stores';
import { toast } from 'react-hot-toast';
import { useSelectionModel } from '../../hooks/use-selection-model';

const daysInWeek = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export const StoreListTable = (props) => {
  const {
    loading,
    pickupStores,
    pickupStoresCount,
    onPageChange,
    onPerPageChange,
    page,
    perPage,
    refetch,
    ...other
  } = props;
  const [updating, setUpdating] = useState(false);
  const { deselectAll, selectAll, deselectOne, selectOne, selected } =
    useSelectionModel(pickupStores);

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

  const updateShipping = useCallback(
    async (storeId, isEnabled = true) => {
      try {
        if (
          !window.confirm(
            `Estás a punto de ${
              isEnabled ? 'habilitar' : 'deshabilitar'
            } el envío para la tienda física seleccionada. ¿Estás seguro?`,
          )
        ) {
          return;
        }
        setUpdating(true);
        await pickupStoresApi.updateShipping(storeId, isEnabled);
        toast.success(
          `Se ha ${
            isEnabled ? 'habilitado' : 'deshabilitado'
          } el envío para la tienda física`,
        );
        refetch?.();
      } catch (err) {
        console.error(err);
        toast.error(
          `No se ha podido ${
            isEnabled ? 'habilitar' : 'deshabilitar'
          } el envío para la tienda física`,
        );
      } finally {
        setUpdating(false);
      }
    },
    [refetch],
  );

  const updateErpId = useCallback(
    async (storeId) => {
      try {
        const erpId = window.prompt(
          'Ingresa el ID de la tienda física en el ERP',
        );
        if (!erpId) {
          return;
        }
        setUpdating(true);
        await pickupStoresApi.updateErpId(storeId, erpId);
        toast.success('Se ha actualizado el ID de la tienda física');
        refetch?.();
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido actualizar el ID de la tienda física');
      } finally {
        setUpdating(false);
      }
    },
    [refetch],
  );

  const selectedAll = selected.length === pickupStores.length;
  const selectedSome =
    selected.length > 0 && selected.length < pickupStores.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button color="error" size="small">
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Prefijo</TableCell>
              <TableCell>Lenguaje</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>País</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox" />
                  {Array.from(new Array(10)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && pickupStores.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                    sx={{ p: 4 }}
                  >
                    No hay tiendas online que coincidan con los criterios de
                    búsqueda
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pickupStores.map((store) => {
                const isSelected = selected.includes(store.id);
                return (
                  <TableRow hover key={store.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(store.id);
                          } else {
                            deselectOne(store.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>{store.id}</TableCell>
                    <TableCell>{store.code}</TableCell>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.order_prefix}</TableCell>
                    <TableCell>{store.language.language}</TableCell>
                    <TableCell>{store.currency.name}</TableCell>
                    <TableCell>{store.country.nicename}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} textAlign="center">
                        <Button size="small">Editar</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

StoreListTable.propTypes = {
  pickupStores: PropTypes.array.isRequired,
  pickupStoresCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  refetch: PropTypes.func,
};
