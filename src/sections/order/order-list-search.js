import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
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
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { useStores } from '../../hooks/use-stores';
import { pickupStoresApi } from '../../api/pickup-stores';

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
    label: 'Abonado multibanco',
    value: 'refunded_multibank',
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

const PAYMENT_METHODS = [
  { id: 1, name: 'Tarjeta de crédito - Visa' },
  { id: 2, name: 'Multibanco' },
  { id: 3, name: 'Google Pay' },
  { id: 4, name: 'Apple Pay' },
  { id: 5, name: 'MBWay' },
  { id: 6, name: 'Paypal' },
  // { id: 7, name: 'Klarna - Pay Now' },
  { id: 8, name: 'Klarna - Pay Over Time' },
  { id: 9, name: 'Klarna - Pay Later' },
  { id: 10, name: 'Tarjeta de crédito - Mastercard' },
  { id: 11, name: 'Oney - FacilyPay 4X' },
  { id: 12, name: 'Oney - FacilyPay 3X' },
  { id: 13, name: 'Tarjeta de crédito - American Express (AMEX)' },
  { id: 15, name: 'Oney - FaciliPay 6X' },
  { id: 16, name: 'Oney - FaciliPay 10X' },
  { id: 17, name: 'Oney - FaciliPay 12X' },
].sort((a, b) => a.name.localeCompare(b.name));

const filtersToChips = (filters) => {
  return Object.entries(filters)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => {
      let label = '';
      let displayValue = '';

      switch (key) {
        case 'search':
          label = 'Buscar';
          displayValue = value;
          break;
        case 'erpId':
          label = 'ERP ID';
          displayValue = value;
          break;
        case 'statusId':
          label = 'Estado';
          displayValue = tabOptions.find(
            (tab) => tab.id.toString() === value?.toString(),
          )?.label;
          break;
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
        case 'paymentMethodId':
          label = 'Método de pago';
          displayValue = PAYMENT_METHODS.find(
            (method) => method.id.toString() === value?.toString(),
          )?.name;
          break;
        case 'email':
          label = 'Email';
          displayValue = value;
          break;
        case 'pickupStoreId':
          label = 'Tienda de recogida';
          displayValue = value;
          break;
        case 'createdFrom':
          label = 'Desde el';
          displayValue = moment(value).format('DD/MM/YYYY');
          break;
        case 'createdTo':
          label = 'Hasta el';
          displayValue = moment(value).format('DD/MM/YYYY');
          break;
        case 'name':
          label = 'Nombre';
          displayValue = value;
          break;
        case 'hourFrom':
          label = 'Desde la hora de';
          displayValue = moment(value).format('HH:mm');
          break;
        case 'hourTo':
          label = 'Hasta la hora de';
          displayValue = moment(value).format('HH:mm');
          break;
        case 'shipmentType':
          label = 'Tipo de envío';
          displayValue =
            value === 'pickup'
              ? 'Recogida en tienda'
              : value === 'locker'
              ? 'Recogida en locker'
              : 'Envío a domicilio';
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

export const OrderListSearch = (props) => {
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

  const handleErpIdChange = useCallback((event) => {
    const erpId = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'erpId');
      if (erpId && erpId.length > 0) {
        chips.push({
          key: 'erpId',
          label: 'ID ERP',
          value: erpId,
          displayValue: erpId,
        });
      }

      return chips;
    });
  }, []);

  const handleStatusIdChange = useCallback((event) => {
    const selectedStatusIds = event.target.value;

    setChips((prevState) => {
      const otherChips = prevState.filter((chip) => chip.key !== 'statusId');

      if (!selectedStatusIds || selectedStatusIds.length === 0) {
        return otherChips;
      }

      return [
        ...otherChips,
        {
          key: 'statusId',
          label: 'Estado',
          value: selectedStatusIds,
          displayValue: selectedStatusIds
            .map(
              (id) =>
                tabOptions?.find((tab) => tab.id.toString() === id.toString())
                  ?.label,
            )
            .join(', '),
        },
      ];
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

  const handlePaymentMethodIdChange = useCallback((event) => {
    const paymentMethodId = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'paymentMethodId');
      if (paymentMethodId && paymentMethodId.length > 0) {
        chips.push({
          key: 'paymentMethodId',
          label: 'Método de pago',
          value: parseInt(paymentMethodId, 10),
          displayValue: PAYMENT_METHODS.find(
            (method) => method.id.toString() === paymentMethodId.toString(),
          )?.name,
        });
      }

      return chips;
    });
  }, []);

  const handleEmailChange = useCallback((event) => {
    const email = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'email');
      if (email && email.length > 0) {
        chips.push({
          key: 'email',
          label: 'Email',
          value: email,
          displayValue: email,
        });
      }

      return chips;
    });
  }, []);

  const handlePickupStoreIdChange = useCallback(
    (event) => {
      const pickupStoreId = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'pickupStoreId');
        if (pickupStoreId && pickupStoreId.length > 0) {
          chips.push({
            key: 'pickupStoreId',
            label: 'Tienda de recogida',
            value: pickupStoreId,
            displayValue: pickupStores.find(
              (store) => store.erp_id.toString() === pickupStoreId.toString(),
            )?.name,
          });
        }

        return chips;
      });
    },
    [pickupStores],
  );

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

  const handleHourFromChange = useCallback((date) => {
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'hourFrom');
      if (date) {
        chips.push({
          key: 'hourFrom',
          label: 'Desde las',
          value: moment(date).format('HH:mm'),
          displayValue: moment(date).format('HH:mm'),
        });
      }

      return chips;
    });
  }, []);

  const handleHourToChange = useCallback((date) => {
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'hourTo');
      if (date) {
        chips.push({
          key: 'hourTo',
          label: 'Hasta las',
          value: moment(date).format('HH:mm'),
          displayValue: moment(date).format('HH:mm'),
        });
      }

      return chips;
    });
  }, []);

  const handleNameChange = useCallback((event) => {
    const name = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'name');
      if (name && name.length > 0) {
        chips.push({
          key: 'name',
          label: 'Nombre',
          value: name,
          displayValue: name,
        });
      }

      return chips;
    });
  }, []);

  const handleShipmentTypeChange = useCallback((event) => {
    const shipmentType = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'shipmentType');

      if (shipmentType && shipmentType.length > 0) {
        let displayValue = '';
        switch (shipmentType) {
          case 'pickup':
            displayValue = 'Recogida en tienda';
            break;
          case 'locker':
            displayValue = 'Recogida en locker';
            break;
          case 'delivery':
          default:
            displayValue = 'Envío a domicilio';
            break;
        }
        chips.push({
          key: 'shipmentType',
          label: 'Tipo de envío',
          value: shipmentType,
          displayValue: displayValue,
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
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
        sx={{ p: 3 }}
      >
        <Box component="form" onSubmit={handleQueryChange} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="orderNumber"
            placeholder="Buscar por número de pedido, nombre, email, ID ERP..."
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            labelId="store-multiselect-label"
            multiple
            label="Estado"
            value={filters.statusId || []}
            onChange={handleStatusIdChange}
            renderValue={(selected) =>
              tabOptions
                .filter((tab) => selected.includes(tab.id))
                .map((tab) => tab.label)
                .join(', ')
            }
            displayEmpty
          >
            {tabOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                ERP ID
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Filtrar por ERP ID"
                onChange={handleErpIdChange}
                value={filters.erpId || ''}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Método de pago
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handlePaymentMethodIdChange}
                select
                SelectProps={{ native: true }}
                value={filters.paymentMethodId || ''}
              >
                <option value="">Todos</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </TextField>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Filtrar por email"
                onChange={handleEmailChange}
                value={filters.email || ''}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Tienda de recogida
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handlePickupStoreIdChange}
                select
                SelectProps={{ native: true }}
                value={filters.pickupStoreId || ''}
              >
                <option value="">Todas</option>
                {pickupStores.map((store) => (
                  <option key={store.id} value={store.erp_id}>
                    {store.name}
                  </option>
                ))}
              </TextField>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Fecha de compra superior a
              </Typography>
              <DatePicker
                format="dd/MM/yyyy"
                label="Fecha de compra desde"
                onChange={handleCreatedFromChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Fecha de compra inferior a
              </Typography>
              <DatePicker
                format="dd/MM/yyyy"
                label="Fecha de compra hasta"
                onChange={handleCreatedToChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Nombre
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Filtrar por nombre"
                onChange={handleNameChange}
                value={filters.name || ''}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Hora de compra desde
              </Typography>
              <TimePicker
                format="HH:mm"
                label="Hora de compra desde"
                onAccept={handleHourFromChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Hora de compra hasta
              </Typography>
              <TimePicker
                format="HH:mm"
                label="Hora de compra hasta"
                onAccept={handleHourToChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ field: { clearable: true } }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Tipo de envío
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleShipmentTypeChange}
                select
                SelectProps={{ native: true }}
                value={filters.shipmentType || ''}
              >
                <option value="">Todos</option>
                <option value="pickup">Recogida en tienda</option>
                <option value="delivery">Envío a domicilio</option>
                <option value="locker">Recogida en locker</option>
              </TextField>
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

OrderListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
