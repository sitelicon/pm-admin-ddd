import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { FileDropzone } from '../../components/file-dropzone';
import { uploadApi } from '../../api/upload';
import { blogLayoutItemApi } from '../../api/blog-layout-item';
import { buttonApi } from '../../api/button';

export const BlogLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [id_button, setIdButton] = useState(0);
  const [buttons, setButtons] = useState([]);

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
    setIdButton(selectedItem?.id_button || '');
    setTitle(selectedItem?.title || '');
    setSubtitle(selectedItem?.subtitle || '');
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

  useEffect(() => {
    buttonApi.getButtons({ allOption: true }).then((res) => {
      setButtons(res.items);
    });
  }, []);
  const onSubmit = async (event) => {
    if (selectedItem) {
      blogLayoutItemApi
        .updateBlogLayoutItem(selectedItem.id, {
          source: url,
          id_button,
          title,
          subtitle,
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        source: url,
        id_button,
        title,
        subtitle,
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
                  label="Title"
                  variant="filled"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Subtitle"
                  variant="filled"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  required
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                      mt: 3,
                    }}
                  >
                    Button
                  </FormLabel>
                  <Select
                    fullWidth
                    value={id_button}
                    onChange={(e) => setIdButton(e.target.value)}
                  >
                    {buttons.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title} ({item.url})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

BlogLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
