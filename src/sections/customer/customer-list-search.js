import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { MultiSelect } from '../../components/multi-select';
import { DatePicker } from '@mui/x-date-pickers';
import { useStores } from '../../hooks/use-stores';

const sortOptions = [
  {
    label: 'Registro (nuevos)',
    value: 'created_at|desc',
  },
  {
    label: 'Registro (antiguos)',
    value: 'created_at|asc',
  },
  {
    label: 'Actualización (reciente)',
    value: 'updated_at|desc',
  },
  {
    label: 'Actualización (antigua)',
    value: 'updated_at|asc',
  },
  {
    label: 'Nombre (A-Z)',
    value: 'name|asc',
  },
  {
    label: 'Nombre (Z-A)',
    value: 'name|desc',
  },
  {
    label: 'Email (A-Z)',
    value: 'email|asc',
  },
  {
    label: 'Email (Z-A)',
    value: 'email|desc',
  },
];

export const CustomerListSearch = (props) => {
  const { open, onFiltersChange, onSortChange, sortBy, sortDir } = props;
  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [chips, setChips] = useState([]);
  const stores = useStores();
  const [filters, setFilters] = useState({
    search: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    groupId: undefined,
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

  const handleChipDelete = useCallback((chipToDelete) => {
    setChips((prev) => prev.filter((chip) => chip.key !== chipToDelete.key));
  }, []);

  const handleSortChange = useCallback(
    (event) => {
      const [sortBy, sortDir] = event.target.value.split('|');

      onSortChange?.({
        sortBy,
        sortDir,
      });
    },
    [onSortChange],
  );

  const handleGroupIdChange = useCallback((event) => {
    const value = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'groupId');
      if (value && value.length > 0) {
        let displayValue = '';
        switch (value) {
          case '1':
            displayValue = 'Fidelizado';
            break;
          case '2':
            displayValue = 'Empleado';
            break;
          case '3':
            displayValue = 'Invitado';
            break;
          default:
            break;
        }

        chips.push({
          key: 'groupId',
          label: 'Grupo',
          value: parseInt(value, 10),
          displayValue,
        });
      }

      return chips;
    });
  }, []);

  const handleEmailChange = useCallback((event) => {
    const value = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'email');
      if (value && value.length > 0) {
        chips.push({
          key: 'email',
          label: 'Email',
          value,
          displayValue: value,
        });
      }

      return chips;
    });
  }, []);

  const handlePhoneChange = useCallback((event) => {
    const value = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'phone');
      if (value && value.length > 0) {
        chips.push({
          key: 'phone',
          label: 'Teléfono',
          value,
          displayValue: value,
        });
      }

      return chips;
    });
  }, []);

  const handleErpIdChange = useCallback((event) => {
    const value = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'erpId');
      if (value && value.length > 0) {
        chips.push({
          key: 'erpId',
          label: 'ERP ID',
          value,
          displayValue: value,
        });
      }

      return chips;
    });
  }, []);

  const handleStoreIdChange = useCallback(
    (event) => {
      const value = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'storeId');
        if (value && value.length > 0) {
          chips.push({
            key: 'storeId',
            label: 'Tienda',
            value,
            displayValue: `${
              stores.find((store) => store.id.toString() === value.toString())
                ?.name
            } (${stores
              .find((store) => store.id.toString() === value.toString())
              ?.code.toUpperCase()})`,
          });
        }

        return chips;
      });
    },
    [stores],
  );

  const showChips = chips.length > 0;

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Box component="form" onSubmit={handleQueryChange} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            placeholder="Buscar clientes por nombre o email"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <TextField
          label="Ordenar por"
          name="sort"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          value={`${sortBy}|${sortDir}`}
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
                placeholder="Buscar por ERP ID"
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
                <option value={1}>Fidelizado</option>
                <option value={2}>Empleado</option>
                <option value={3}>Invitado</option>
                {/* <option value={3}>Invitado</option> */}
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
                    {store.name} ({store.code.toUpperCase()})
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
                placeholder="Dirección de correo electrónico"
                onChange={handleEmailChange}
                value={filters.email || ''}
              />
            </Stack>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Teléfono
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Número de teléfono"
                onChange={handlePhoneChange}
                value={filters.phone || ''}
              />
            </Stack>
          </Grid> */}
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
    </>
  );
};

CustomerListSearch.propTypes = {
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
