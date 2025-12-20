import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { FileDropzone } from '../../components/file-dropzone';
import { uploadApi } from '../../api/upload';
import { bannerTextLayoutItemApi } from '../../api/banner-text-layout-item';

export const BannerTextLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');

  const handleDrop = useCallback((newFiles) => {
    setFiles(newFiles);
    const formData = new FormData();
    formData.append('files[]', newFiles[0], newFiles[0].fileName);
    uploadApi.upload(formData).then((res) => {
      setUrl(res.data[0]?.url);
    });
  }, []);

  useEffect(() => {
    setUrl(selectedItem?.source || '');
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
      bannerTextLayoutItemApi
        .updateBannerTextLayoutItem(selectedItem.id, {
          source: url,
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        source: url,
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
                  Crear elemento de diseño de control deslizante
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
                  Crear
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

BannerTextLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
