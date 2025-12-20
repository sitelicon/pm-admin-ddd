import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import { bannerTextLayoutItemApi } from '../../api/banner-text-layout-item';

export const BannerTextLayoutItemCard = ({
  index,
  bannerTextItem,
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
    bannerTextLayoutItemApi
      .deleteBannerTextLayoutItem(bannerTextItem.id)
      .then((res) => {
        refetch();
      });
  };

  return (
    <Draggable draggableId={bannerTextItem.id.toString()} index={index}>
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
            <MenuItem onClick={onEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>

          <img src={bannerTextItem.source} style={{ height: 200 }} />
        </Paper>
      )}
    </Draggable>
  );
};

BannerTextLayoutItemCard.propTypes = {
  index: PropTypes.number,
  bannerTextItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
