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
  TextField,
  Typography,
} from '@mui/material';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { useStores } from '../../hooks/use-stores';

const sortOptions = [
  {
    label: 'Creación (nuevos)',
    value: 'created_at|desc',
  },
  {
    label: 'Creación (antiguos)',
    value: 'created_at|asc',
  },
  {
    label: 'Nombre (A-Z)',
    value: 'name|asc',
  },
  {
    label: 'Nombre (Z-A)',
    value: 'name|desc',
  },
];

export const PickupStoreListSearch = (props) => {
  const { open, onFiltersChange, onSortChange, sortBy, sortDir } = props;
  const queryRef = useRef(null);
  const [chips, setChips] = useState([]);
  const stores = useStores();
  const [filters, setFilters] = useState({
    search: undefined,
    storeId: undefined,
    sortBy: 'created_at',
    sortDir: 'desc',
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

  const handleStoreIdChange = useCallback(
    (event) => {
      const storeId = event.target.value;
      setChips((prevState) => {
        const chips = prevState.filter((chip) => chip.key !== 'storeId');
        if (storeId && storeId.length > 0) {
          chips.push({
            key: 'storeId',
            label: 'Tienda',
            value: stores.find((store) => store.id == storeId)?.code,
            displayValue: stores.find((store) => store.id == storeId)?.name,
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
            placeholder="Buscar tiendas por nombre"
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
      <Collapse in={!open}>
        <Divider />
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontSize={10}
              >
                Tiendas
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

PickupStoreListSearch.propTypes = {
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
