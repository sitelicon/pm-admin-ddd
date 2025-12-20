import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Chip,
  Divider,
  Input,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { MultiSelect } from '../../components/multi-select';
import { useUpdateEffect } from '../../hooks/use-update-effect';

export const CategoryListSearch = (props) => {
  const { onFiltersChange, ...other } = props;
  const queryRef = useRef(null);
  const [query, setQuery] = useState('');

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setQuery(queryRef.current?.value?.trim() || '');
  }, []);

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={(event) => event.preventDefault()}
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
          placeholder="Buscar por nombre de la categoría"
          onChange={handleQueryChange}
          sx={{ flexGrow: 1 }}
          value={query}
        />
      </Stack>
    </div>
  );
};

CategoryListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
};
