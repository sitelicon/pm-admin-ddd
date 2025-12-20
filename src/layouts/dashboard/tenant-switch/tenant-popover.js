import { MenuItem, Popover } from '@mui/material';

export const TenantPopover = (props) => {
  const {
    anchorEl,
    onChange,
    onClose,
    open = false,
    tenants,
    ...other
  } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 'auto' } }}
      {...other}
    >
      {tenants.map((tenant) => (
        <MenuItem key={tenant} onClick={() => onChange?.(tenant)}>
          {tenant}
        </MenuItem>
      ))}
    </Popover>
  );
};
