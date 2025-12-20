import { useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import CreditCard01Icon from '@untitled-ui/icons-react/build/esm/CreditCard01';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import {
  Box,
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';
import { paths } from '../../../paths';
import { Issuer } from '../../../utils/auth';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      onClose?.();
      await signOut();
      router.push(paths.auth.login);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, [signOut, router, onClose]);

  if (!user) {
    return null;
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      {/* <Box sx={{ p: 1 }}>
        <ListItemButton
          component={NextLink}
          href={paths.social.profile}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <User03Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Perfil</Typography>}
          />
        </ListItemButton>
        <ListItemButton
          component={NextLink}
          href={paths.account}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Ajustes</Typography>}
          />
        </ListItemButton>
      </Box>
      <Divider sx={{ my: '0 !important' }} /> */}
      <Box
        sx={{
          display: 'flex',
          p: 1,
          justifyContent: 'center',
        }}
      >
        <Button color="inherit" onClick={handleLogout} size="small">
          Cerrar sesión
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
