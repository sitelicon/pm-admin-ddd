import { useCallback } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { ArrowRight } from '@untitled-ui/icons-react';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { OrderDetails } from './order-details';

export const OrderDrawer = (props) => {
  const { container, onClose, open, order } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  let content = null;

  if (order) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            position: 'sticky',
            top: 0,
            background: (theme) => theme.palette.background.paper,
            px: 3,
            pt: 2,
            zIndex: 1,
          }}
        >
          <Typography color="inherit" variant="h6">
            Pedido # {order.order_number}
          </Typography>
          <Button
            color="inherit"
            LinkComponent={NextLink}
            href={`/orders/${order.id}`}
            size="small"
            endIcon={
              <SvgIcon>
                <ArrowRight />
              </SvgIcon>
            }
          >
            Ver página completa
          </Button>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 4,
          }}
        >
          <OrderDetails onClose={onClose} order={order} />
        </Box>
      </div>
    );
  }

  if (lgUp) {
    return (
      <Drawer
        anchor="right"
        open={open}
        PaperProps={{
          sx: {
            position: 'relative',
            width: 550,
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: 'none',
          position: 'absolute',
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: '100%',
          width: 400,
          pointerEvents: 'auto',
          position: 'absolute',
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

OrderDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object,
};
