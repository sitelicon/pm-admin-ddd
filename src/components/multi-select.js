import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';

export const MultiSelect = (props) => {
  const {
    label,
    onChange,
    options,
    value = [],
    useTextField = false,
    ...other
  } = props;
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleValueChange = useCallback(
    (event) => {
      let newValue = [...value];

      if (event.target.checked) {
        newValue.push(event.target.value);
      } else {
        newValue = newValue.filter((item) => item !== event.target.value);
      }

      onChange?.(newValue);
    },
    [onChange, value],
  );

  if (useTextField) {
    return (
      <TextField
        fullWidth
        label={label}
        onChange={handleValueChange}
        select
        SelectProps={{
          multiple: true,
          renderValue: (selected) => {
            return selected
              .map((value) => {
                const option = options.find(
                  (option) => option.value.toString() === value.toString(),
                );

                return option?.label;
              })
              .join(', ');
          },
        }}
        value={value}
        {...other}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.includes(option.value.toString())}
                  onChange={handleValueChange}
                  value={option.value}
                  size="small"
                />
              }
              label={<Typography variant="body2">{option.label}</Typography>}
              sx={{
                flexGrow: 1,
                mr: 0,
              }}
            />
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        endIcon={
          <SvgIcon>
            <ChevronDownIcon />
          </SvgIcon>
        }
        onClick={handleMenuOpen}
        ref={anchorRef}
        {...other}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        onClose={handleMenuClose}
        open={openMenu}
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map((option) => (
          <MenuItem key={option.label}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.includes(option.value)}
                  onChange={handleValueChange}
                  value={option.value}
                />
              }
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  useTextField: PropTypes.bool,
};
