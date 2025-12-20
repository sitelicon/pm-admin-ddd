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
import { instagramLayoutItemApi } from '../../api/instagram-layout-item';

export const InstagramLayoutItemCard = ({
  index,
  instagramItem,
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
    instagramLayoutItemApi
      .deleteInstagramLayoutItem(instagramItem.id)
      .then((res) => {
        refetch();
      });
  };

  return (
    <Draggable draggableId={instagramItem.id.toString()} index={index}>
      {(provided) => (
        <Paper
          elevation={12}
          sx={{ p: 3, pb: 1, position: 'relative', width: '300px' }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box>
            <img
              src={instagramItem.source}
              style={{ height: 200, width: '100%' }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  mr: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                gutterBottom
              >
                {instagramItem.url}
              </Typography>

              <Box sx={{ mr: 0.5 }}>
                <Stack
                  justifyContent="flex-end"
                  alignItems="center"
                  direction="row"
                  spacing={0}
                >
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={handleMenuOpen}
                    ref={menuRef}
                  >
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
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

InstagramLayoutItemCard.propTypes = {
  index: PropTypes.number,
  instagramItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
