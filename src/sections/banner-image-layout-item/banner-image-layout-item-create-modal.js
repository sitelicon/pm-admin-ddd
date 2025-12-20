import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { bannerImageLayoutItemApi } from '../../api/banner-image-layout-item';
import { buttonApi } from '../../api/button';
import { useLanguages } from '../../hooks/use-languages';

export const BannerImageLayoutItemCreateModal = ({
  open,
  onClose,
  onCreate,
  selectedItem,
  refetch,
}) => {
  const languages = useLanguages();
  const [languageId, setLanguageId] = useState(
    selectedItem?.language_id || languages[0]?.id,
  );
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
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
    setTitle(selectedItem?.title || '');
    setIdButton(selectedItem?.id_button || '');
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
      bannerImageLayoutItemApi
        .updateBannerImageLayoutItem(selectedItem.id, {
          source: url,
          title,
          id_button,
          language_id: Number(languageId),
        })
        .then((res) => {
          refetch();
          onClose();
        });
    } else {
      onCreate({
        source: url,
        title,
        id_button,
        language_id: languageId,
      });
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form>
        <DialogTitle>
          <Typography variant="h5">
            {selectedItem ? 'Editar item' : 'Crear item'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Título"
              variant="filled"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <TextField
              select
              SelectProps={{ native: true }}
              fullWidth
              label="Idioma"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              value={languageId}
              onChange={(event) => setLanguageId(event.target.value)}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              {languages.map((item, index) => (
                <option key={item.id} value={item.id}>
                  {item.language} ({item.iso.toUpperCase()})
                </option>
              ))}
            </TextField>
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
            <FileDropzone
              accept={{ '*/*': [] }}
              caption="El archivo no debe pesar más de 100 MB."
              maxFiles={1}
              files={files}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              onUpload={onClose}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack alignItems="center" direction="row" spacing={3}>
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
              {selectedItem ? 'Guardar' : 'Crear'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

BannerImageLayoutItemCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  selectedItem: PropTypes.object,
  refetch: PropTypes.func,
};
