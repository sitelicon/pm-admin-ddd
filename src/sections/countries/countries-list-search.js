import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useUpdateEffect } from '../../hooks/use-update-effect';

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
];

export const CountriesSearch = (props) => {
  const { onFiltersChange, onSortChange, sortBy, sortDir } = props;
  const queryRef = useRef(null);
  const [chips, setChips] = useState([]);
  const [filters, setFilters] = useState({
    search: undefined,
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
            placeholder="Buscar países por nombre"
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

CountriesSearch.propTypes = {
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
