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

export const PickupStoreListTable = (props) => {
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
              <TableCell>ERP ID</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Envío</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Código postal</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Teléfono</TableCell>
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
                    No hay tiendas físicas que coincidan con los criterios de
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
                    <TableCell>
                      {store.erp_id || (
                        <Typography color="text.secondary" variant="body2">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        arrow
                        placement="top"
                        title={store.opening_hours.periods
                          .filter(
                            (period) =>
                              !!period.open.time && !!period.close.time,
                          )
                          .sort((a, b) => {
                            const aDay = parseInt(a.open.day, 10);
                            const bDay = parseInt(b.open.day, 10);
                            if (aDay === 0) return 1;
                            if (bDay === 0) return -1;
                            return aDay - bDay;
                          })
                          .map((period, index) => {
                            const { open, close } = period;
                            return (
                              <Typography
                                key={index}
                                variant="body2"
                                whiteSpace="nowrap"
                                fontSize={12}
                              >
                                {daysInWeek[open.day]}: {open.time}-{close.time}
                              </Typography>
                            );
                          })}
                      >
                        <Link
                          color="primary"
                          component={NextLink}
                          href={`/pickup-stores/${store.id}`}
                          variant="caption"
                        >
                          {store.name.trim()}
                        </Link>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <SeverityPill
                        color={store.shipping_enabled ? 'success' : 'error'}
                      >
                        {store.shipping_enabled
                          ? 'Habilitado'
                          : 'Deshabilitado'}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{store.formatted_address}</TableCell>
                    <TableCell>
                      {store.city || (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{store.cp}</TableCell>
                    <TableCell>{store.country}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2">
                          {store.formatted_phone_number ? (
                            <Typography variant="body2" whiteSpace="nowrap">
                              {store.prefix} {store.formatted_phone_number}
                            </Typography>
                          ) : (
                            <Typography
                              color="text.secondary"
                              variant="caption"
                            >
                              N/A
                            </Typography>
                          )}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} textAlign="center">
                        <Button
                          size="small"
                          onClick={() => updateErpId(store.id)}
                          disabled={updating}
                        >
                          {updating ? 'Actualizando...' : 'Actualizar ERP ID'}
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            updateShipping(store.id, !store.shipping_enabled)
                          }
                          disabled={updating}
                          color={store.shipping_enabled ? 'error' : 'success'}
                        >
                          {updating
                            ? `${
                                store.shipping_enabled
                                  ? 'Deshabilitando'
                                  : 'Habilitando'
                              } envío...`
                            : `${
                                store.shipping_enabled
                                  ? 'Deshabilitar'
                                  : 'Habilitar'
                              } envío`}
                        </Button>
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

PickupStoreListTable.propTypes = {
  pickupStores: PropTypes.array.isRequired,
  pickupStoresCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  refetch: PropTypes.func,
};
