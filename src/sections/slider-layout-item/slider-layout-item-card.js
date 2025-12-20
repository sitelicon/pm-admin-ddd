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
import { sliderLayoutItemApi } from '../../api/slider-layout-item';

export const SliderLayoutItemCard = ({
  index,
  sliderItem,
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
    sliderLayoutItemApi.deleteSliderLayoutItem(sliderItem.id).then((res) => {
      refetch();
    });
  };

  if (!sliderItem) {
    return null;
  }

  if (!sliderItem.source) {
    // El archivo no se ha subido correctamente
    return (
      <Box>
        <Paper elevation={12} sx={{ p: 3, position: 'relative' }}>
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
          <Chip
            label="Error al cargar el archivo, vuelva a intentar a subir el archivo"
            color="primary"
          />
        </Paper>
      </Box>
    );
  }
  return (
    <Draggable draggableId={sliderItem.id.toString()} index={index}>
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

          {!!sliderItem.is_image && (
            <img src={sliderItem.source} style={{ height: 200 }} />
          )}
          {!!sliderItem.is_video && (
            <video
              src={sliderItem.source}
              style={{ height: 300 }}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          )}
        </Paper>
      )}
    </Draggable>
  );
};

SliderLayoutItemCard.propTypes = {
  index: PropTypes.number,
  sliderItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
