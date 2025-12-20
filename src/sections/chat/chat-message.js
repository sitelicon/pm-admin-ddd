import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Dialog,
  Stack,
  Typography,
} from '@mui/material';
import { es } from 'date-fns/locale';

export const ChatMessage = (props) => {
  const {
    authorAvatar,
    authorName,
    body,
    contentType,
    createdAt,
    position,
    withImage,
    imageUrl = null,
    ...other
  } = props;

  const ago = formatDistanceToNowStrict(createdAt, {
    locale: es,
  });

  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: position === 'right' ? 'flex-end' : 'flex-start',
      }}
      {...other}
    >
      <Stack
        alignItems="flex-start"
        direction={position === 'right' ? 'row-reverse' : 'row'}
        spacing={2}
        sx={{
          maxWidth: 500,
          ml: position === 'right' ? 'auto' : 0,
          mr: position === 'left' ? 'auto' : 0,
        }}
      >
        {authorAvatar && (
          <Avatar
            src={authorAvatar || undefined}
            sx={{
              height: 32,
              width: 32,
            }}
          />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              backgroundColor:
                position === 'right' ? 'primary.paper' : 'background.paper',
              color: position === 'right' ? 'primary.primary' : 'text.primary',
              px: 2,
              py: 1,
            }}
          >
            <Stack spacing={1}>
              <Typography color="inherit" variant="caption">
                {authorName}
              </Typography>
              {withImage && imageUrl.split('.').pop() === 'pdf' && (
                <iframe
                  src={imageUrl}
                  style={{
                    minWidth: '430px',
                    width: '470px',
                    height: '300px',
                    border: '1px solid #ccc',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              )}
              {withImage && imageUrl.split('.').pop() !== 'pdf' && (
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt="Image added by customer"
                  sx={{
                    borderRadius: 1,
                    cursor: 'pointer',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              )}
              {contentType === 'text' && (
                <Typography
                  color="inherit"
                  variant="body1"
                  sx={{ mt: '6px !important' }}
                  dangerouslySetInnerHTML={{
                    __html: body,
                  }}
                />
              )}
            </Stack>
          </Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
              mt: 1,
              px: 2,
            }}
          >
            <Typography color="text.secondary" noWrap variant="caption">
              hace {ago}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <img src={imageUrl} alt="Image added by customer" />
      </Dialog>
    </Box>
  );
};

ChatMessage.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  withImage: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
};
