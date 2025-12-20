import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Grid,
  CardMedia,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { buttonApi } from '../../api/button';
import { FileDropzone } from '../../components/file-dropzone';
import { SketchPicker } from 'react-color';
import { color, fontSize } from '@mui/system';

export const LandingHeader = ({
  title,
  imageUrl,
  backgroundColor,
  button,
  order,
  is_mobile,
  is_tablet,
  editable,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
  buttons,
}) => {
  const [open, setOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || '');
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl || '');
  const [hexadecimal, setHexadecimal] = useState(backgroundColor);
  const [headerButtom, setHeaderButton] = useState(button?.id || 0);
  const [file, setFile] = useState([]);

  const [isMobile, setIsMobile] = useState(is_mobile);
  const [isTablet, setIsTablet] = useState(is_tablet);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const toggleColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const closeColorPicker = () => {
    setDisplayColorPicker(false);
  };

  const handleDrop = useCallback((newFile) => {
    setFile(newFile);
  }, []);

  const handleRemove = useCallback(() => {
    setFile([]);
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFile([]);
  }, []);

  const handleEditOpen = () => {
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onEdit({
      title: editedTitle,
      image_url: file[0],
      background_color: hexadecimal,
      button_id: headerButtom,
      is_mobile: isMobile,
      is_tablet: isTablet,
    }); // Llama a la función de edición con los valores editados
    handleEditClose(); // Cierra el modal
  };

  const handleChangeColorHex = (hex) => {
    setHexadecimal(hex);
  };

  useEffect(() => {}, []);

  return (
    <Box
      sx={{
        height: imageUrl ? '280px' : 'auto',
        backgroundColor: backgroundColor || 'transparent',
        p: 2,

        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 0,
        position: 'relative',
      }}
    >
      <Typography
        variant="h5"
        className="text-start"
        color={imageUrl ? 'white' : 'black'}
      >
        {is_mobile ? 'Móvil' : is_tablet ? 'Tablet' : 'Desktop'}
      </Typography>
      {editable && (
        <>
          <IconButton
            onClick={handleEditOpen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={onMoveUp}
            variant="contained"
            sx={{
              position: 'absolute',
              top: 8,
              right: 42,
              color: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            onClick={onMoveDown}
            variant="contained"
            sx={{
              position: 'absolute',
              top: 8,
              right: 72,
              color: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            marginTop: imageUrl ? '12%' : '40px',
            color: imageUrl ? 'white' : 'black',
          }}
        >
          {title || 'Sin título definido'}
        </Typography>

        {/* Botón o enlace */}
        {button && button.type === 'button' && (
          <button
            type="button"
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
              marginTop: 8,
              cursor: 'pointer',
            }}
          >
            {button.title || 'BUTTON'}
          </button>
        )}
        {button && button.type === 'link' && (
          <a
            href={button.url}
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
            {button.title || 'LINK'}
          </a>
        )}
      </Box>

      {/* Modal de edición */}
      <Dialog open={open} onClose={handleEditClose} maxWidth="lg">
        <DialogTitle>Editar Header</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item marginTop={1.5} xs={12} md={4}>
              <TextField
                margin="dense"
                label="Título"
                type="text"
                fullWidth
                variant="outlined"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </Grid>
            <Grid item marginTop={1.5} xs={12} md={4}>
              <TextField
                fullWidth
                margin="dense"
                label="Boton"
                select
                SelectProps={{ native: true }}
                value={headerButtom || 'Sin Boton'}
                onChange={(event) => setHeaderButton(event.target.value)}
              >
                <option>Sin Boton</option>
                {buttons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.url})
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography marginLeft={0} fontSize={12}>
                Color de fondo
              </Typography>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box
                    onClick={toggleColorPicker}
                    className="w-full"
                    sx={{
                      backgroundColor: hexadecimal,
                      borderRadius: 1,
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      height: 56,
                      marginRight: 2,
                      cursor: 'pointer',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Color seleccionado"
                    onClick={toggleColorPicker}
                    value={hexadecimal}
                    type="text"
                    onChange={({ target }) =>
                      setHexadecimal(target.value.toUpperCase())
                    }
                  />
                </Grid>
              </Grid>
              {displayColorPicker && (
                <div style={{ position: 'absolute', zIndex: 2, top: 40 }}>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                    onClick={closeColorPicker}
                  />
                  <SketchPicker
                    color={hexadecimal}
                    onChange={({ hex }) => handleChangeColorHex(hex)}
                    onChangeComplete={({ hex }) => handleChangeColorHex(hex)}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography marginLeft={0} fontSize={12}>
                Imagen de fondo Tipo:{' '}
                {isMobile ? 'Móvil' : isTablet ? 'Tablet' : 'Ordenador'}
              </Typography>
              {imageUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl || '/assets/errors/error-404.png'}
                  alt="carrousel item"
                  sx={{ mb: 1 }}
                />
              )}
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }}>
            <Button onClick={handleEditClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </Box>
          <Box>
            <Button color="error" onClick={onDelete}>
              Eliminar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
