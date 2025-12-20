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
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '../../components/file-dropzone';
import { uploadApi } from '../../api/upload';
import { categoryLayoutItemApi } from '../../api/category-layout-item';
import { buttonApi } from '../../api/button';
import { useStores } from '../../hooks/use-stores';
import { useLanguages } from '../../hooks/use-languages';

export const CategoryLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const router = useRouter();
  const stores = useStores();
  const languages = useLanguages();
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [id_button, setIdButton] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

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
    setSelectedLanguage(selectedItem?.language_id || 1);
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
    buttonApi.getButtons({ allOption: true, rowsPerPage: 150 }).then((res) => {
      setButtons(res.items);
    });
  }, []);
  const onSubmit = async (event) => {
    if (selectedItem) {
      categoryLayoutItemApi
        .updateCategoryLayoutItem(selectedItem.id, {
          source: url,
          language_id: selectedLanguage,
          id_button,
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        source: url,
        id_button,
        language_id: selectedLanguage,
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
                  {selectedItem ? 'Editar' : 'Crear'} Item
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
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Lenguaje
                  </FormLabel>
                  <Select
                    fullWidth
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languages.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                      mt: 3,
                    }}
                  >
                    Botón
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

CategoryLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
