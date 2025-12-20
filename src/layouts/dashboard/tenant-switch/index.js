import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import { Box, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { TenantPopover } from './tenant-popover';

const tenants = [
  '🇪🇸 Español',
  '🇵🇹 Portugues',
  '🇮🇹 Italiano',
  '🇫🇷 Frances',
  '🇵🇹 Madeira',
];

export const TenantSwitch = (props) => {
  const anchorRef = useRef(null);
  const [tenant, setTenant] = useState(tenants[0]);
  const [openPopover, setOpenPopover] = useState(false);

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const handleTenantChange = useCallback((tenant) => {
    setOpenPopover(false);
    setTenant(tenant);
  }, []);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" variant="h6" sx={{ mb: 0.5 }}>
            PACOMARTINEZ
          </Typography>
          <Typography color="neutral.500" variant="body2">
            Enterprise resource planning
          </Typography>
        </Box>
        {/* <IconButton onClick={handlePopoverOpen} ref={anchorRef}>
          <SvgIcon sx={{ fontSize: 16 }}>
            <ChevronDownIcon />
          </SvgIcon>
        </IconButton> */}
      </Stack>
      {/* <TenantPopover
        anchorEl={anchorRef.current}
        onChange={handleTenantChange}
        onClose={handlePopoverClose}
        open={openPopover}
        tenants={tenants}
      /> */}
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
