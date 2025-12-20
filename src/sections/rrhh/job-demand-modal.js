import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  Stack,
} from '@mui/material';

export const JobDemandModal = ({ open, onClose, src }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Paper elevation={12} sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Card
              sx={{
                maxHeight: '80vh',
                maxWidth: '80vw',
                overflowY: 'scroll',
              }}
            >
              <CardActionArea>
                <CardMedia component="img" src={src} />
              </CardActionArea>
            </Card>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

JobDemandModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
