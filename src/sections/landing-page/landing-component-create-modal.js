import React, { useCallback, useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormLabel,
  Box,
  FormControl,
  CardContent,
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import PropTypes from 'prop-types';
import { buttonApi } from '../../api/button';
import { FileDropzone } from '../../components/file-dropzone';

export const LandingCreateComponentModal = ({
  open,
  onClose,
  componentType,
  onAddComponent,
  refetch,
}) => {
  const [componentData, setComponentData] = useState({
    title: '',
    order: 1,
    language_id: 1,
    background_color: '',
    image_url: '',
    button_id: '',
    type: componentType,
    type_box: '',
    is_mobile: 0,
    is_tablet: 0,
  });

  const [buttons, setButtons] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type_box, setTypeBox] = useState('');

  const [id_button, setIdButton] = useState();
  const [file, setFile] = useState([]);
  const [hexadecimal, setHexadecimal] = useState('#FFFFFF');

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const handleDrop = useCallback((newFiles) => {
    setFile(newFiles);
  }, []);

  const handleRemove = useCallback(() => {
    setFile([]);
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFile(null);
  }, []);

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == 'button_id') setIdButton(value);
    setComponentData({ ...componentData, [name]: value });
  };

  const handleChangeColorHex = (hex) => {
    setHexadecimal(hex);
    componentData.background_color = hex;
  };

  // Enviamos el archivo junto con los demás datos al agregar el componente
  const handleSubmit = () => {
    componentData.button_id = id_button ? id_button : 0;
    componentData.url = url;
    componentData.image_url = file[0];
    componentData.language_id = 1;
    componentData.is_mobile = isMobile ? 1 : 0;
    componentData.is_tablet = isTablet ? 1 : 0;

    //reseteo form
    setUrl('');
    setTitle('');
    setTypeBox('');
    setIdButton();
    setFile([]);
    setHexadecimal('#FFFFFF');
    setIsMobile(false);
    setIsTablet(false);

    onAddComponent(componentData); // Enviar el componente al padre
  };

  useEffect(() => {
    if (open) {
      setComponentData({
        title: title,
        order: 1,
        language_id: 1,
        background_color: hexadecimal,
        image_url: file,
        button_id: id_button,
        type: componentType,
        type_box: type_box,
        is_mobile: isMobile ? 1 : 0,
        is_tablet: isTablet ? 1 : 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    buttonApi.getButtons({ allOption: true }).then((res) => {
      setButtons(res.items);
    });
  }, []);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Agregar Nuevo {componentType === 'header' ? 'Banner' : componentType}
      </DialogTitle>

      <DialogContent>
        {/* Campos específicos según el tipo de componente */}

        {componentType === 'box' && (
          <>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: 'text.primary',
                  mb: 1,
                  mt: 3,
                }}
              >
                Tipo
              </FormLabel>
              <Select
                fullWidth
                name="type_box"
                value={componentData.type_box}
                onChange={handleInputChange}
              >
                <MenuItem key="flex" value="flex">
                  Flex
                </MenuItem>
                <MenuItem key="list" value="list">
                  List
                </MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {componentType === 'header' && (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Título"
              type="text"
              fullWidth
              onChange={handleInputChange}
              value={componentData.title}
            />
          </>
        )}

        {(componentType === 'header' || componentType === 'carrousel') && (
          <>
            <FormControl fullWidth>
              <TextField
                label="Boton"
                fullWidth
                margin="dense"
                name="button_id"
                select
                SelectProps={{ native: true }}
                value={id_button || 'Sin Boton'}
                onChange={handleInputChange}
              >
                <option>Sin Boton</option>
                {buttons.map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.url})
                  </option>
                ))}
              </TextField>
            </FormControl>
            <Card>
              <CardHeader
                title="Color de fondo"
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
              <Divider />
              <CardContent>
                <Stack spacing={1} direction={'row'}>
                  <Box>
                    <SketchPicker
                      color={componentData.background_color}
                      disableAlpha
                      onChange={({ hex }) => handleChangeColorHex(hex)}
                      onChangeComplete={({ hex }) => handleChangeColorHex(hex)}
                    />
                  </Box>
                  <Stack direction={'column'} className="w-1/2" spacing={2}>
                    <Box
                      className="w-full"
                      sx={{
                        backgroundColor: `${componentData.background_color}`,
                        borderRadius: 1,
                        border: '1px solid #E0E0E0',
                        display: 'flex',
                        height: 100,
                      }}
                    />
                    <TextField
                      fullWidth
                      name="background_color"
                      value={componentData.background_color}
                      type="text"
                      onChange={({ target }) =>
                        setHexadecimal(target.value.toUpperCase())
                      }
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </>
        )}

        {componentType === 'header' && (
          <Card>
            <CardHeader
              title="Imagen de fondo"
              titleTypographyProps={{ variant: 'subtitle2' }}
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <FileDropzone
                  accept={{ 'image/*': [] }}
                  caption="(SVG, JPG, PNG, o GIF)"
                  files={file}
                  maxFiles={1}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  hideUploadButton={true}
                />
              </Stack>
            </CardContent>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Si no selecciona un tamaño, la imagen es para tamaño ordenador
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMobile}
                    onChange={(event, checked) => {
                      setIsMobile(checked);
                      if (checked) setIsTablet(false);
                    }}
                  />
                }
                label="Es móvil"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isTablet}
                    onChange={(event, checked) => {
                      setIsTablet(checked);
                      if (checked) setIsMobile(false);
                    }}
                  />
                }
                label="Es tablet"
              />
            </Box>
          </Card>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Agregar</Button>
      </DialogActions>
    </Dialog>
  );
};

LandingCreateComponentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  refetch: PropTypes.func.isRequired,
};
