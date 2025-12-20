import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Modal,
  Paper,
  Stack,
  Switch,
  Typography,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '../../components/file-dropzone';
import { uploadApi } from '../../api/upload';
import { sliderLayoutItemApi } from '../../api/slider-layout-item';

export const SliderLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const router = useRouter();
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [path, setPath] = useState('');

  const handleDrop = useCallback((newFiles) => {
    setFiles(newFiles);
    const formData = new FormData();
    const extension = newFiles[0]?.name?.split('.')?.pop();

    if (['jpeg', 'jpg', 'png'].includes(extension)) {
      setIsImage(true);
      setIsVideo(false);
    }
    if (extension === 'mp4') {
      setIsImage(false);
      setIsVideo(true);
    }
    formData.append('files[]', newFiles[0], newFiles[0].fileName);
    uploadApi.upload(formData).then((res) => {
      setUrl(res.data[0]?.url);
    });
  }, []);

  useEffect(() => {
    setUrl(selectedItem?.source || '');
    setIsImage(selectedItem?.is_image || false);
    setIsVideo(selectedItem?.is_video || false);
    setIsMobile(selectedItem?.is_mobile || false);
    setPath(selectedItem?.path || '');
  }, [selectedItem]);

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (event) => {
    if (selectedItem) {
      sliderLayoutItemApi
        .updateSliderLayoutItem(selectedItem.id, {
          is_image: isImage,
          is_mobile: isMobile,
          is_video: isVideo,
          source: url,
          path,
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        is_image: isImage,
        is_mobile: isMobile,
        is_video: isVideo,
        source: url,
        path,
      });
    }
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
      <Box sx={{ width: 560 }}>
        <Container maxWidth="sm">
          <form>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {selectedItem
                    ? 'Editar item'
                    : 'Crear elemento de diseño de control deslizante'}
                </Typography>

                <FileDropzone
                  accept={{ '*/*': [] }}
                  caption="Max file size is 3 MB"
                  maxFiles={1}
                  files={files}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUpload={onClose}
                />

                <TextField
                  fullWidth
                  label="URL"
                  margin="normal"
                  name="path"
                  onChange={(event) => setPath(event.target.value)}
                  type="text"
                  value={path}
                  variant="outlined"
                  placeholder="/viaje/maletas"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={isImage}
                      onChange={(event, checked) => setIsImage(checked)}
                    />
                  }
                  label="es imagen"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isVideo}
                      onChange={(event, checked) => setIsVideo(checked)}
                    />
                  }
                  label="es vídeo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isMobile}
                      onChange={(event, checked) => setIsMobile(checked)}
                    />
                  }
                  label="es móvil"
                />
              </Box>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
                sx={{ mt: 4 }}
              >
                <Button
                  color="inherit"
                  fullWidth
                  size="large"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={onSubmit}
                >
                  {selectedItem ? 'Guardar cambios' : 'Crear '}
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

SliderLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
