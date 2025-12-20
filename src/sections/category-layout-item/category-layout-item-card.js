import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Chip,
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
import { categoryLayoutItemApi } from '../../api/category-layout-item';

export const CategoryLayoutItemCard = ({
  index,
  categoryItem,
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
    categoryLayoutItemApi
      .deleteCategoryLayoutItem(categoryItem.id)
      .then((res) => {
        refetch();
      });
  };

  return (
    <Draggable draggableId={categoryItem.id.toString()} index={index}>
      {(provided) => (
        <Paper
          elevation={12}
          sx={{ p: 0.2, position: 'relative', width: '100%', height: '100%' }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box sx={{ position: 'absolute', right: 15, top: 5 }}>
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

          <img
            src={categoryItem.source}
            style={{ height: '100%', width: '100%' }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: 20,
              transform: 'translateX(-50%)',
            }}
          >
            {categoryItem.category_button.type === 'button' && (
              <button type="button" href={categoryItem.category_button.url}>
                {categoryItem.category_button.title}
              </button>
            )}
            {categoryItem.category_button.type === 'link' && (
              <a href={categoryItem.category_button.url}>
                {categoryItem.category_button.title}
              </a>
            )}
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

CategoryLayoutItemCard.propTypes = {
  index: PropTypes.number,
  categoryItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
