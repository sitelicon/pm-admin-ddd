import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Grid,
  Input,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { MultiSelect } from '../../components/multi-select';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Calendar, Coins03, Package, Sale01 } from '@untitled-ui/icons-react';
import numeral from 'numeral';
import { categoriesApi } from '../../api/categories';

const sortOptions = [
  {
    label: 'Antiguos',
    value: 'created_at:asc',
  },
  {
    label: 'Recientes',
    value: 'created_at:desc',
  },
  {
    label: 'SKU (Ascendente)',
    value: 'sku:asc',
  },
  {
    label: 'SKU (Descendente)',
    value: 'sku:desc',
  },
];

const revertCategory = (acc, category, parentNames = []) => {
  const data = category.data.find(({ language_id }) => language_id === 1);

  if (!data) {
    return acc;
  }

  return [
    ...acc,
    {
      label: [...parentNames, data.name].join(' → '),
      name: data.name,
      value: category.id,
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(childAcc, children, [...parentNames, data.name]),
      [],
    ),
  ];
};

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategories();
      setCategories(
        response.reduce((acc, category) => revertCategory(acc, category), []),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { categories, loading };
};

const filtersToChips = (filters, categoryOptions) => {
  return Object.entries(filters)
    .filter(([field, value]) => !!value)
    .reduce((acc, [field, value]) => {
      switch (field) {
        case 'search':
          if (value) {
            acc.push({
              label: 'Búsqueda',
              field: field,
              value: value,
              displayValue: value,
            });
          }
          break;
        case 'draft':
          if (value) {
            acc.push({
              label: 'Estado',
              field: field,
              value: value,
              displayValue: value === 'true' ? 'Deshabilitado' : 'Habilitado',
            });
          }
          break;
        case 'minPrice':
          if (value) {
            acc.push({
              label: 'Precio desde',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('$0,0.00'),
            });
          }
          break;
        case 'maxPrice':
          if (value) {
            acc.push({
              label: 'Precio hasta',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('$0,0.00'),
            });
          }
          break;
        case 'minDiscountPrice':
          if (value) {
            acc.push({
              label: 'Precio de descuento desde',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('$0,0.00'),
            });
          }
          break;
        case 'maxDiscountPrice':
          if (value) {
            acc.push({
              label: 'Precio de descuento hasta',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('$0,0.00'),
            });
          }
          break;
        case 'minStock':
          if (value) {
            acc.push({
              label: 'Stock desde',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('0,0'),
            });
          }
          break;
        case 'maxStock':
          if (value) {
            acc.push({
              label: 'Stock hasta',
              field: field,
              value: value.toString(),
              displayValue: numeral(value).format('0,0'),
            });
          }
          break;
        case 'sku':
          if (value) {
            acc.push({
              label: 'SKU',
              field: field,
              value: value,
              displayValue: value,
            });
          }
          break;
        case 'categoryIds':
          if (value && value.length > 0) {
            value.forEach((categoryId) => {
              const option = categoryOptions.find(
                (option) => option.value.toString() === categoryId.toString(),
              );
              acc.push({
                label: 'Categoría',
                field: field,
                value: categoryId,
                displayValue: option?.label || 'Cargando…',
              });
            });
          }
          break;
        case 'skuOrRef':
          if (value) {
            acc.push({
              label: 'SKU / Referencia',
              field: field,
              value: value,
              displayValue: value,
            });
          }
          break;
        case 'sort':
          if (value) {
            acc.push({
              label: 'Ordenar por',
              field: field,
              value: value,
              displayValue: sortOptions.find((option) => option.value === value)
                ?.label,
            });
          }
          break;
        default:
          break;
      }

      return acc;
    }, []);
};

export const ProductListSearch = ({
  open,
  initialFilters,
  onFiltersChange,
  ...other
}) => {
  const queryRef = useRef(null);
  const [query, setQuery] = useState('');
  const { categories: categoryOptions } = useCategories();
  const [chips, setChips] = useState(() =>
    filtersToChips(initialFilters, categoryOptions),
  );

  useEffect(() => {
    if (chips.some((chip) => chip.field === 'categoryIds')) {
      setChips((prev) =>
        prev.map((chip) => {
          if (chip.field === 'categoryIds') {
            const option = categoryOptions.find(
              (option) => option.value.toString() === chip.value.toString(),
            );
            return { ...chip, displayValue: option?.label || 'Cargando…' };
          }

          return chip;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryOptions]);

  const handleChipsUpdate = useCallback(() => {
    const filters = {
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minDiscountPrice: undefined,
      maxDiscountPrice: undefined,
      minStock: undefined,
      maxStock: undefined,
      sku: undefined,
      draft: undefined,
      categoryIds: [],
      skuOrRef: undefined,
      sort: undefined,
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case 'search':
          filters.search = chip.value;
          break;
        case 'categoryIds':
          filters.categoryIds.push(chip.value);
          break;
        case 'draft':
          filters.draft = chip.value;
          break;
        case 'minPrice':
          filters.minPrice = chip.value;
          break;
        case 'maxPrice':
          filters.maxPrice = chip.value;
          break;
        case 'minDiscountPrice':
          filters.minDiscountPrice = chip.value;
          break;
        case 'maxDiscountPrice':
          filters.maxDiscountPrice = chip.value;
          break;
        case 'minStock':
          filters.minStock = chip.value;
          break;
        case 'maxStock':
          filters.maxStock = chip.value;
          break;
        case 'sku':
          filters.sku = chip.value;
          break;
        case 'skuOrRef':
          filters.skuOrRef = chip.value;
          break;
        case 'sort':
          filters.sort = chip.value;
          break;
        default:
          break;
      }
    });

    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip) => {
    setChips((prevChips) => {
      return prevChips.filter((chip) => {
        // There can exist multiple chips for the same field.
        // Filter them by value.

        return !(
          deletedChip.field === chip.field && deletedChip.value === chip.value
        );
      });
    });
  }, []);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setQuery(queryRef.current?.value || '');
  }, []);

  const handleQuerySubmit = useCallback(
    (event) => {
      event.preventDefault();
      setChips((prevChips) => {
        const newChips = prevChips.filter((chip) => chip.field !== 'search');

        if (
          queryRef.current?.value &&
          queryRef.current.value.trim().length > 0
        ) {
          newChips.push({
            label: 'Búsqueda',
            field: 'search',
            value: queryRef.current.value,
            displayValue: queryRef.current.value,
          });
        }

        return newChips;
      });
      setQuery('');
    },
    [queryRef],
  );

  const handleCategoryChange = useCallback(
    (values) => {
      setChips((prevChips) => {
        const valuesFound = [];

        // First cleanup the previous chips
        const newChips = prevChips.filter((chip) => {
          if (chip.field !== 'categoryIds') {
            return true;
          }

          const found = values.includes(chip.value);

          if (found) {
            valuesFound.push(chip.value);
          }

          return found;
        });

        // Nothing changed
        if (values.length === valuesFound.length) {
          return newChips;
        }

        values.forEach((value) => {
          if (!valuesFound.includes(value)) {
            const option = categoryOptions.find(
              (category) => category.value.toString() === value.toString(),
            );

            newChips.push({
              label: 'Categoría',
              field: 'categoryIds',
              value,
              displayValue: option.label,
            });
          }
        });

        return newChips;
      });
    },
    [categoryOptions],
  );

  const handleMinPriceChange = useCallback((event) => {
    const { value } = event.target;
    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'minPrice');

      if (value) {
        newChips.push({
          label: 'Precio desde',
          field: 'minPrice',
          value: value.toString(),
          displayValue: numeral(parseFloat(value)).format('$0,0.00'),
        });
      }

      return newChips;
    });
  }, []);

  const handleMaxPriceChange = useCallback((event) => {
    const { value } = event.target;
    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'maxPrice');

      if (value) {
        newChips.push({
          label: 'Precio hasta',
          field: 'maxPrice',
          value: value.toString(),
          displayValue: numeral(parseFloat(value)).format('$0,0.00'),
        });
      }

      return newChips;
    });
  }, []);

  const handleMinDiscountPriceChange = useCallback((event) => {
    const { value } = event.target;
    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter(
        (chip) => chip.field !== 'minDiscountPrice',
      );

      if (value) {
        newChips.push({
          label: 'Precio con descuento desde',
          field: 'minDiscountPrice',
          value: value.toString(),
          displayValue: numeral(parseFloat(value)).format('$0,0.00'),
        });
      }

      return newChips;
    });
  }, []);

  const handleMaxDiscountPriceChange = useCallback((event) => {
    const { value } = event.target;
    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter(
        (chip) => chip.field !== 'maxDiscountPrice',
      );

      if (value) {
        newChips.push({
          label: 'Precio con descuento hasta',
          field: 'maxDiscountPrice',
          value: value.toString(),
          displayValue: numeral(parseFloat(value)).format('$0,0.00'),
        });
      }

      return newChips;
    });
  }, []);

  const handleMinStockChange = useCallback((event) => {
    const { value } = event.target;
    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'minStock');

      if (value) {
        newChips.push({
          label: 'Stock desde',
          field: 'minStock',
          value: value.toString(),
          displayValue: value.toLocaleString('es-ES'),
        });
      }

      return newChips;
    });
  }, []);

  const handleMaxStockChange = useCallback((event) => {
    const { value } = event.target;

    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'maxStock');

      if (value) {
        newChips.push({
          label: 'Stock hasta',
          field: 'maxStock',
          value: value.toString(),
          displayValue: value.toLocaleString('es-ES'),
        });
      }

      return newChips;
    });
  }, []);

  const handleDraftChange = useCallback((event) => {
    const { value } = event.target;

    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'draft');

      if (value) {
        newChips.push({
          label: 'Estado',
          field: 'draft',
          value,
          displayValue: value === 'true' ? 'Deshabilitado' : 'Habilitado',
        });
      }

      return newChips;
    });
  }, []);

  const handleSkuOrRefChange = useCallback((event) => {
    const { value } = event.target;

    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'skuOrRef');

      if (value) {
        newChips.push({
          label: 'SKU / Referencia',
          field: 'skuOrRef',
          value,
          displayValue: value,
        });
      }

      return newChips;
    });
  }, []);

  const handleSortChange = useCallback((event) => {
    const { value } = event.target;

    setChips((prevChips) => {
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => chip.field !== 'sort');

      if (value) {
        newChips.push({
          label: 'Ordenar por',
          field: 'sort',
          value,
          displayValue: sortOptions.find((option) => option.value === value)
            ?.label,
        });
      }

      return newChips;
    });
  }, []);

  // We memoize this part to prevent re-render issues
  const categoryValues = useMemo(
    () =>
      chips
        .filter((chip) => chip.field === 'categoryIds')
        .map((chip) => chip.value),
    [chips],
  );

  const statusValues = useMemo(
    () =>
      chips.filter((chip) => chip.field === 'status').map((chip) => chip.value),
    [chips],
  );

  const stockValues = useMemo(() => {
    const values = chips
      .filter((chip) => chip.field === 'inStock')
      .map((chip) => chip.value);

    // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
    if (values.length === 0) {
      values.unshift('all');
    }

    return values;
  }, [chips]);

  const minPriceValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'minPrice');
    return chip?.value || '';
  }, [chips]);

  const maxPriceValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'maxPrice');
    return chip?.value || '';
  }, [chips]);

  const minDiscountPriceValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'minDiscountPrice');
    return chip?.value || '';
  }, [chips]);

  const maxDiscountPriceValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'maxDiscountPrice');
    return chip?.value || '';
  }, [chips]);

  const minStockValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'minStock');
    return chip?.value || '';
  }, [chips]);

  const maxStockValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'maxStock');
    return chip?.value || '';
  }, [chips]);

  const draftValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'draft');
    return chip?.value || '';
  }, [chips]);

  const skuOrRefValue = useMemo(() => {
    const chip = chips.find((chip) => chip.field === 'skuOrRef');
    return chip?.value || '';
  }, [chips]);

  const showChips = chips.length > 0;

  return (
    <Stack {...other}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
        sx={{ p: 3 }}
      >
        <Box component="form" onSubmit={handleQuerySubmit} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="orderNumber"
            placeholder="Buscar por nombre o sku del producto"
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
          value={
            chips.find((chip) => chip.field === 'sort')?.value ||
            'created_at:asc'
          }
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
      {/* <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQuerySubmit}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Buscar por nombre o sku del producto"
          onChange={handleQueryChange}
          sx={{ flexGrow: 1 }}
          value={query}
        />
      </Stack> */}
      <Collapse in={open}>
        <Divider />
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SvgIcon fontSize="small" color="action">
                  <Coins03 />
                </SvgIcon>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontSize={10}
                >
                  Precio
                </Typography>
              </Stack>
              <TextField
                fullWidth
                label="Desde"
                onChange={handleMinPriceChange}
                type="number"
                value={minPriceValue}
              />
              <TextField
                fullWidth
                label="Hasta"
                onChange={handleMaxPriceChange}
                type="number"
                value={maxPriceValue}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SvgIcon fontSize="small" color="action">
                  <Sale01 />
                </SvgIcon>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontSize={10}
                >
                  Precio con descuento
                </Typography>
              </Stack>
              <TextField
                fullWidth
                label="Desde"
                onChange={handleMinDiscountPriceChange}
                type="number"
                value={minDiscountPriceValue}
              />
              <TextField
                fullWidth
                label="Hasta"
                onChange={handleMaxDiscountPriceChange}
                type="number"
                value={maxDiscountPriceValue}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SvgIcon fontSize="small" color="action">
                  <Package />
                </SvgIcon>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontSize={10}
                >
                  Stock A1
                </Typography>
              </Stack>
              <TextField
                fullWidth
                label="Desde"
                onChange={handleMinStockChange}
                type="number"
                value={minStockValue}
              />
              <TextField
                fullWidth
                label="Hasta"
                onChange={handleMaxStockChange}
                type="number"
                value={maxStockValue}
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
                Estado
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                onChange={handleDraftChange}
                select
                SelectProps={{ native: true }}
                value={draftValue}
              >
                <option value="">Todos</option>
                <option value="true">Deshabilitado</option>
                <option value="false">Habilitado</option>
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
                Categorías
              </Typography>
              <MultiSelect
                label="Seleccionar categorías"
                onChange={handleCategoryChange}
                options={categoryOptions}
                value={categoryValues}
                useTextField
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
                SKU / Referencia
              </Typography>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="SKU o referencia"
                onChange={handleSkuOrRefChange}
                value={skuOrRefValue}
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
      {/* <Divider /> */}
      {/* <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Categoría"
          onChange={handleCategoryChange}
          options={categoryOptions}
          value={categoryValues}
        />
        <MultiSelect
          label="Estado"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        />
        <MultiSelect
          label="Stock"
          onChange={handleStockChange}
          options={stockOptions}
          value={stockValues}
        />
      </Stack> */}
    </Stack>
  );
};

ProductListSearch.propTypes = {
  initialFilters: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onFiltersChange: PropTypes.func,
};
