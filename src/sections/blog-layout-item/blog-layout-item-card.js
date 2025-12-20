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
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import { blogLayoutItemApi } from '../../api/blog-layout-item';

export const BlogLayoutItemCard = ({ index, blogItem, refetch, onEdit }) => {
  const menuRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleDelete = () => {
    blogLayoutItemApi.deleteBlogLayoutItem(blogItem.id).then((res) => {
      refetch();
    });
  };

  return (
    <Draggable draggableId={blogItem.id.toString()} index={index}>
      {(provided) => (
        <Paper
          elevation={12}
          sx={{ p: 3, position: 'relative', width: '300px' }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Box>
            <img src={blogItem.source} style={{ height: 200, width: '100%' }} />

            <Box sx={{ pt: 2, position: 'relative' }}>
              <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
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
              <Typography variant="h6" gutterBottom>
                {blogItem.title}
              </Typography>
              <Typography gutterBottom>{blogItem.subtitle}</Typography>

              {blogItem.blog_button.type === 'button' && (
                <button
                  type="button"
                  href={blogItem.blog_button.url}
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                    lineHeight: '1.25rem',
                    padding: '0.5rem 1rem',
                    margin: '0',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  {blogItem.blog_button.title}
                </button>
              )}
              {blogItem.blog_button.type === 'link' && (
                <a
                  href={blogItem.blog_button.url}
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    borderRadius: '0px',
                    lineHeight: '1.25rem',
                    padding: '0.5rem 0',
                    margin: '0',
                    cursor: 'pointer',
                    color: 'black',
                    textUnderlineOffset: '0.25rem',
                    textDecoration: 'underline',
                    textDecorationThickness: '0.125rem',
                  }}
                >
                  {blogItem.blog_button.title}
                </a>
              )}
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

BlogLayoutItemCard.propTypes = {
  index: PropTypes.number,
  blogItem: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
};
