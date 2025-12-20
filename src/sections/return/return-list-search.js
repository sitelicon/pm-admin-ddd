import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
import { DatePicker } from '@mui/x-date-pickers';
import { useStores } from '../../hooks/use-stores';
import moment from 'moment';

const tabOptions = [
  {
    id: 1,
    label: 'Aprobado',
    value: 'approved',
  },
  {
    id: 2,
    label: 'Cancelado',
    value: 'canceled',
  },
  {
    id: 3,
    label: 'Cerrado',
    value: 'closed',
  },
  {
    id: 4,
    label: 'Reembolso emitido',
    value: 'issue_refund',
  },
  {
    id: 5,
    label: 'Paquete recibido',
    value: 'package_received',
  },
  {
    id: 6,
    label: 'Paquete enviado',
    value: 'package_sent',
  },
  {
    id: 7,
    label: 'Pendiente de aprobación',
    value: 'pending_approval',
  },
];

export const ReturnListSearch = ({ onFiltersChange, open = false }) => {
  const [chips, setChips] = useState([]);
  const stores = useStores();
  const [orderNumberSearch, setOrderNumberSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [filters, setFilters] = useState({
    orderNumber: undefined,
    createdAt: undefined,
    status: undefined,
    storeId: undefined,
  });

  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);

  useUpdateEffect(() => {
    setFilters(
      chips.reduce((acc, chip) => ({ ...acc, [chip.key]: chip.value }), {}),
    );
  }, [chips]);

  const handleChipDelete = useCallback((chipToDelete) => {
    setChips((prev) => prev.filter((chip) => chip.key !== chipToDelete.key));
  }, []);

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      setChips((prev) => [
        ...prev.filter((chip) => chip.key !== 'orderNumber'),
        {
          key: 'orderNumber',
          label: 'Número de pedido',
          displayValue: orderNumberSearch,
          value: orderNumberSearch,
        },
      ]);
      setOrderNumberSearch('');
    }
  };

  const handleStatusIdChange = useCallback((event) => {
    const statusId = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'statusId');
      if (statusId && statusId.length > 0) {
        chips.push({
          key: 'status',
          label: 'Estado',
          value: statusId,
          displayValue: tabOptions.find((option) => option.value === statusId)
            .label,
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

  const showChips = chips.length > 0;

  return (
    <div>
      <Collapse in={open}>
        <Divider />
        <Grid container spacing={1} sx={{ py: 2.5 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número de pedido, nombre de cliente..."
              onChange={(e) =>
                setOrderNumberSearch(e.target.value.trim().toLowerCase())
              }
              onKeyPress={handleEnterPress}
              value={orderNumberSearch}
            />
          </Grid>
          <Grid item xs={12} md={2}>
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
          </Grid>
          <Grid item xs={12} md={2}>
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
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Estado"
              name="status"
              onChange={handleStatusIdChange}
              select
              SelectProps={{ native: true }}
              value={filters.status || ''}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Todos</option>
              {tabOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Tienda"
              hiddenLabel
              onChange={handleStoreIdChange}
              select
              SelectProps={{ native: true }}
              value={filters.storeId || ''}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">Todas</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </TextField>
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

ReturnListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  open: PropTypes.bool,
};
