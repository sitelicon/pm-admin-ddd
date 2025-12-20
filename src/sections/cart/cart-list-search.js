import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AlertCircle,
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
} from '@untitled-ui/icons-react';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { useStores } from '../../hooks/use-stores';
import { pickupStoresApi } from '../../api/pickup-stores';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const tabOptions = [
  {
    id: 1,
    label: 'Pendientes',
    value: 'pending',
    icon: <Clock />,
  },
  {
    id: 2,
    label: 'Pagos fallidos',
    value: 'payment_failed',
    icon: <CreditCardX />,
  },
  {
    id: 3,
    label: 'En preparación',
    value: 'under_packaging',
    icon: <ShoppingBag01 />,
  },
  {
    id: 4,
    label: 'Preparados',
    value: 'packaged',
    icon: <Package />,
  },
  {
    id: 5,
    label: 'Enviados',
    value: 'customer_shipped',
    icon: <Truck01 />,
  },
  {
    id: 6,
    label: 'En camino',
    value: 'shop_shipped',
    icon: <Truck01 />,
  },
  {
    id: 7,
    label: 'En tienda',
    value: 'shop_received',
    icon: <Building02 />,
  },
  {
    id: 8,
    label: 'Entregados',
    value: 'delivered',
    icon: <PackageCheck />,
  },
  {
    id: 9,
    label: 'Cancelados',
    value: 'canceled',
    icon: <PackageX />,
  },
  {
    id: 10,
    label: 'Solicitud de devolución',
    value: 'refund_request',
    icon: <FlipBackward />,
  },
  {
    id: 11,
    label: 'Abonados',
    value: 'refunded',
    icon: <CreditCardCheck />,
  },
  {
    id: 16,
    label: 'Incidencias',
    value: 'incidence',
    icon: <AlertCircle />,
  },
  {
    id: 18,
    label: 'Abonados Multibanco',
    value: 'refunded_multibank  ',
    icon: <CreditCardCheck />,
  },
];

const sortOptions = [
  {
    label: 'Recientes',
    value: 'desc',
  },
  {
    label: 'Antiguos',
    value: 'asc',
  },
];

const CUSTOMER_GROUPS = [
  { id: 1, name: 'Fidelizado' },
  { id: 2, name: 'Empleado' },
  { id: 3, name: 'Invitado' },
].sort((a, b) => a.name.localeCompare(b.name));

const filtersToChips = (filters) => {
  return Object.entries(filters)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => {
      let label = '';
      let displayValue = '';

      switch (key) {
        case 'storeId':
          label = 'Tienda';
          displayValue = stores.find(
            (store) => store.id.toString() === value?.toString(),
          )?.name;
          break;
        case 'groupId':
          label = 'Grupo';
          displayValue = CUSTOMER_GROUPS.find(
            (group) => group.id.toString() === value?.toString(),
          )?.name;
          break;
        case 'createdFrom':
          label = 'Desde el';
          displayValue = moment(value).format('DD/MM/YYYY');
          break;
        case 'createdTo':
          label = 'Hasta el';
          displayValue = moment(value).format('DD/MM/YYYY');
          break;
        default:
          break;
      }

      return {
        key,
        label,
        value,
        displayValue,
      };
    });
};

const usePickupStores = () => {
  const [state, setState] = useState({
    pickupStores: [],
    pickupStoresCount: 0,
    loading: true,
  });

  const getPickupStores = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await pickupStoresApi.getStores();
      setState({
        pickupStores: response,
        pickupStoresCount: response.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getPickupStores();
  }, [getPickupStores]);

  return { ...state, refetch: getPickupStores };
};

export const CartListSearch = (props) => {
  const {
    open,
    initialFilters,
    totalItems,
    onFiltersChange,
    onSortChange,
    sortBy = 'created_at',
    sortDir = 'asc',
    loading,
  } = props;
  const queryRef = useRef(null);
  const stores = useStores();
  const { pickupStores } = usePickupStores();
  const [chips, setChips] = useState(() => filtersToChips(initialFilters));

  const handleChipsUpdate = useCallback(() => {
    onFiltersChange?.(
      chips.reduce((acc, chip) => ({ ...acc, [chip.key]: chip.value }), {}),
    );
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();

    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'search');
      const query = queryRef.current?.value;
      if (query && query.length > 0) {
        chips.push({
          key: 'search',
          label: 'Buscar',
          value: query,
          displayValue: query,
        });
      }

      return chips;
    });
  }, []);

  const handleSortChange = useCallback(
    (event) => {
      const sortDir = event.target.value;
      onSortChange?.(sortDir);
    },
    [onSortChange],
  );

  const handleStatusIdChange = useCallback((event) => {
    const statusId = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'statusId');
      if (statusId && statusId.length > 0) {
        chips.push({
          key: 'statusId',
          label: 'Estado',
          value: parseInt(statusId, 10),
          displayValue: tabOptions.find(
            (tab) => tab.id.toString() === statusId.toString(),
          )?.label,
        });
      }

      return chips;
    });
  }, []);

  const handleStoreIdChange = useCallback(
    (event) => {
      const storeId = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'storeId');
        if (storeId && storeId.length > 0) {
          chips.push({
            key: 'storeId',
            label: 'Tienda',
            value: parseInt(storeId, 10),
            displayValue: stores.find(
              (store) => store.id.toString() === storeId.toString(),
            )?.name,
          });
        }

        return chips;
      });
    },
    [stores],
  );

  const handleGroupIdChange = useCallback((event) => {
    const groupId = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'groupId');
      if (groupId && groupId.length > 0) {
        chips.push({
          key: 'groupId',
          label: 'Grupo',
          value: parseInt(groupId, 10),
          displayValue: CUSTOMER_GROUPS.find(
            (group) => group.id.toString() === groupId.toString(),
          )?.name,
        });
      }

      return chips;
    });
  }, []);

  const handleCreatedFromChange = useCallback((date) => {
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'createdFrom');
      if (date) {
        chips.push({
          key: 'createdFrom',
          label: 'Desde el',
          value: moment(date).format('YYYY-MM-DD'),
          displayValue: moment(date).format('DD/MM/YYYY'),
        });
      }

      return chips;
    });
  }, []);

  const handleCreatedToChange = useCallback((date) => {
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'createdTo');
      if (date) {
        chips.push({
          key: 'createdTo',
          label: 'Hasta el',
          value: moment(date).format('YYYY-MM-DD'),
          displayValue: moment(date).format('DD/MM/YYYY'),
        });
      }

      return chips;
    });
  }, []);

  const handleChipDelete = useCallback((chipToDelete) => {
    setChips((prev) => prev.filter((chip) => chip.key !== chipToDelete.key));
  }, []);

  const filters = useMemo(
    () => chips.reduce((acc, chip) => ({ ...acc, [chip.key]: chip.value }), {}),
    [chips],
  );

  const showChips = chips.length > 0;

  return (
    <div>
      <Stack
        justifyContent="flex-end"
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ p: 3 }}
      >
        <TextField
          label="Ordenar por"
          name="sort"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          value={sortDir}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
      <Collapse in={open}>
        <Divider />
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Tienda
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleStoreIdChange}
                select
                SelectProps={{ native: true }}
                value={filters.storeId || ''}
              >
                <option value="">Todas</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </TextField>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Grupo
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleGroupIdChange}
                select
                SelectProps={{ native: true }}
                value={filters.groupId || ''}
              >
                <option value="">Todos</option>
                {CUSTOMER_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </TextField>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Fecha superior a
              </Typography>
              <DatePicker
                format="dd/MM/yyyy"
                label="Fecha desde"
                onChange={handleCreatedFromChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                // value={() => {
                //   const chip = chips.find((chip) => chip.key === 'createdFrom');
                //   return chip?.value ? new Date(chip.value) : null;
                // }}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Fecha inferior a
              </Typography>
              <DatePicker
                format="dd/MM/yyyy"
                label="Fecha hasta"
                onChange={handleCreatedToChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                // value={() => {
                //   const chip = chips.find((chip) => chip.key === 'createdTo');
                //   return chip?.value ? new Date(chip.value) : null;
                // }}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Collapse>
      <Divider />
      {showChips ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2 }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    '& span': {
                      fontWeight: 600,
                    },
                  }}
                >
                  <>
                    <span>{chip.label}</span>: {chip.displayValue || chip.value}
                  </>
                </Box>
              }
              onDelete={() => handleChipDelete(chip)}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography color="text.secondary" variant="subtitle2">
            No hay filtros aplicados
          </Typography>
        </Box>
      )}
    </div>
  );
};

CartListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
