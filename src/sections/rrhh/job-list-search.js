import { useCallback, useEffect, useState } from 'react';
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
import { pickupStoresApi } from '../../api/pickup-stores';

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

export const JobListSearch = (props) => {
  const { open, onFiltersChange, onSortChange, sortBy, sortDir } = props;
  const { pickupStores, loading: loadingStores } = usePickupStores();
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

  const handleChipDelete = useCallback((chipToDelete) => {
    setChips((prev) => prev.filter((chip) => chip.key !== chipToDelete.key));
  }, []);

  const handleVisibiltyChange = useCallback((event) => {
    const value = event.target.value;
    setChips((prevState) => {
      const chips = prevState.filter((chip) => chip.key !== 'visibility');
      if (value) {
        chips.push({
          key: 'visibility',
          label: 'Visibilidad',
          value: value,
          displayValue: value === 'true' ? 'Visible' : 'No visible',
        });
      }

      return chips;
    });
  }, []);

  const handleStoreChange = useCallback(
    (event) => {
      const value = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'store');
        if (value && value.length > 0) {
          chips.push({
            key: 'store',
            label: 'Tienda',
            value: value,
            displayValue: pickupStores.find((store) => store.id == value)?.name,
          });
        }

        return chips;
      });
    },
    [pickupStores],
  );

  const showChips = chips.length > 0;

  return (
    <>
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
                Visibilidad
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleVisibiltyChange}
                select
                SelectProps={{ native: true }}
                value={filters.visibility || ''}
              >
                <option key={'visible'} value={''}>
                  Seleccione una opción..
                </option>
                <option key={'visible'} value={true}>
                  Visible
                </option>
                <option key={'no-visible'} value={false}>
                  No visible
                </option>
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
                onChange={(event) => {
                  handleStoreChange(event);
                }}
                select
                SelectProps={{ native: true }}
                value={filters.store || ''}
              >
                <option key={''} value={''}>
                  Seleccione una opción..
                </option>
                {!loadingStores && pickupStores.length > 0 ? (
                  pickupStores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    Cargando...
                  </option>
                )}
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
    </>
  );
};

JobListSearch.propTypes = {
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
