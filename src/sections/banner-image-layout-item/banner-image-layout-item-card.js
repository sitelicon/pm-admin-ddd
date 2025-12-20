import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import { bannerImageLayoutItemApi } from '../../api/banner-image-layout-item';

export const BannerImageLayoutItemCard = ({
  index,
  bannerImageItem,
  refetch,
  onEdit,
}) => {
  const menuRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleDelete = () => {
    bannerImageLayoutItemApi
      .deleteBannerImageLayoutItem(bannerImageItem.id)
      .then((res) => {
        refetch();
      });
  };

  return (
    <Draggable draggableId={bannerImageItem.id.toString()} index={index}>
      {(provided) => (
        <Paper
          elevation={12}
          sx={{ p: 3, position: 'relative' }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box sx={{ position: 'absolute', right: 24, top: 24 }}>
            <Stack
              justifyContent="flex-end"
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <IconButton edge="end" onClick={handleMenuOpen} ref={menuRef}>
                <SvgIcon>
                  <DotsHorizontalIcon />
                </SvgIcon>
              </IconButton>
            </Stack>
          </Box>
          <Menu
            anchorEl={menuRef.current}
            anchorOrigin={{
              horizontal: 'end',
              vertical: 'bottom',
            }}
            keepMounted
            onClose={handleMenuClose}
            open={openMenu}
          >
            <MenuItem onClick={onEdit}>Editar</MenuItem>
            <MenuItem onClick={handleDelete}>Borrar</MenuItem>
          </Menu>
          <Box sx={{ display: 'flex' }} gap={2}>
            <img src={bannerImageItem.source} style={{ height: 200 }} />

            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: 'center' }}
              >
                {bannerImageItem.title}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <u>Información del botón</u>
                </Typography>
                <Typography gutterBottom>
                  <strong>Titulo:</strong>{' '}
                  {bannerImageItem.banner_image_layout_item_button?.title}
                </Typography>
                <Typography gutterBottom>
                  <strong>URL:</strong>{' '}
                  {bannerImageItem.banner_image_layout_item_button?.url}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

BannerImageLayoutItemCard.propTypes = {
  index: PropTypes.number,
  bannerImageItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
