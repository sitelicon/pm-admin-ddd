import { useCallback, useEffect, useRef, useState } from 'react';
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
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users';

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

const useAccountRoles = () => {
  const [state, setState] = useState({
    roles: [],
    loading: false,
  });

  const getRoles = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await usersApi.getRoles();
      setState((prevState) => ({ ...prevState, roles: response }));
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar los roles.');
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return state;
};

export const AccountListSearch = (props) => {
  const { open, onFiltersChange, onSortChange, sortBy, sortDir } = props;
  const { roles, loading: loadingRoles } = useAccountRoles();
  const queryRef = useRef(null);
  const [chips, setChips] = useState([]);
  const [filters, setFilters] = useState({
    search: undefined,
    name: undefined,
    email: undefined,
    roleId: undefined,
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

  const handleRoleIdChange = useCallback(
    (event) => {
      const value = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'roleId');
        if (value && value.length > 0) {
          chips.push({
            key: 'roleId',
            label: 'Rol',
            value: parseInt(value, 10),
            displayValue: roles.find((role) => role.id === parseInt(value, 10))
              ?.name,
          });
        }

        return chips;
      });
    },
    [roles],
  );

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
            placeholder="Buscar cuentas por nombre o email"
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
                Rol
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleRoleIdChange}
                select
                SelectProps={{ native: true }}
                value={filters.roleId || ''}
              >
                {loadingRoles ? (
                  <option value="" disabled>
                    Cargando roles…
                  </option>
                ) : (
                  <>
                    <option value="">Todos</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </>
                )}
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

AccountListSearch.propTypes = {
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
