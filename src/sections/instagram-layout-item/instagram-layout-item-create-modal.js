import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { FileDropzone } from '../../components/file-dropzone';
import { uploadApi } from '../../api/upload';
import { instagramLayoutItemApi } from '../../api/instagram-layout-item';

export const InstagramLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');

  const handleDrop = useCallback((newFiles) => {
    setFiles(newFiles);
    const formData = new FormData();
    formData.append('files[]', newFiles[0], newFiles[0].fileName);
    uploadApi.upload(formData).then((res) => {
      setSource(res.data[0]?.url);
    });
  }, []);

  useEffect(() => {
    setSource(selectedItem?.source || '');
    setUrl(selectedItem?.url || '');
  }, [selectedItem, open]);

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
      instagramLayoutItemApi
        .updateInstagramLayoutItem(selectedItem.id, {
          source,
          url,
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        source,
        url,
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

                <TextField
                  fullWidth
                  label="Url"
                  variant="filled"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  sx={{ mt: 2 }}
                />
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

InstagramLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
