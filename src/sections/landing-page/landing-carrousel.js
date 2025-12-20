import toast from 'react-hot-toast';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  Stack,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Slider from 'react-slick';
import { SketchPicker } from 'react-color';
import { FileDropzone } from '../../components/file-dropzone';
import { landingPageApi } from '../../api/landing-page';
import DeleteIcon from '@mui/icons-material/Delete';

export const LandingCarrousel = ({
  button_id,
  order,
  id,
  onEdit,
  landingId,
  editable,
  onMoveUp,
  onMoveDown,
  onDelete,
  items,
  imageUrl,
  button,
  buttons,
  links,
  is_mobile,
  is_tablet,
}) => {
  const isHexColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);
  const isImageUrl = (value) => /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(value);

  const [open, setOpen] = useState(false); // Estado del modal
  const [editedItems, setEditedItems] = useState(items);
  const [hexadecimal, setHexadecimal] = useState(
    isHexColor(imageUrl) ? `${imageUrl}` : '',
  );
  const [imageBack, setImgBack] = useState(
    isImageUrl(imageUrl) ? `url(${imageUrl})` : 'none',
  );
  const [carrouselButtomId, setCarrouselmButtonId] = useState(button_id);
  const [carrouselButtom, setCarrouselmButton] = useState(button);
  const [itemId, setItemId] = useState(null);
  const [itemUrl, setItemUrl] = useState();
  const [itemButtom, setItemButton] = useState('');
  const [itemOrder, setItemOrder] = useState(editedItems?.length + 1);
  const [file, setFile] = useState([]);
  const [fileBG, setFileBG] = useState([]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [carrouseltData, setDataEdit] = useState({});

  const [isMobile, setIsMobile] = useState(is_mobile);
  const [isTablet, setIsTablet] = useState(is_tablet);

  const [isMobileItem, setIsMobileItem] = useState(false);
  const [isTabletItem, setIsTabletItem] = useState(false);

  const [maxOrder, setMaxOrder] = useState(editedItems?.length + 1);

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
  const handleFilesUpload = useCallback(async () => {}, []);

  const handleDropBG = useCallback((newFile) => {
    setFileBG(newFile);
  }, []);
  const handleRemoveBG = useCallback(() => {
    setFileBG([]);
  }, []);
  const handleRemoveAllBG = useCallback(() => {
    setFileBG([]);
  }, []);
  const handleFilesUploadBG = useCallback(async () => {}, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //funcion para reordenar los ordenes si se elimina un item
  const reOrderItems = async (items) => {
    const reorderedItems = items
      .sort((a, b) => a.order - b.order) // Ordena los elementos en base a su orden actual
      .map((item, index) => ({
        ...item,
        order: index + 1, // Asigna un nuevo orden consecutivo desde 1
      }));

    // Llama a la API para actualizar los órdenes de los elementos restantes
    await Promise.all(
      reorderedItems.map((item) =>
        landingPageApi.updateLandingPageCarrouselItem(landingId, id, item.id, {
          order: item.order,
        }),
      ),
    );

    // Actualiza el estado local con los nuevos órdenes
    setEditedItems(reorderedItems);
  };

  const handleDeleteItem = async (index, itemId) => {
    if (
      window.confirm(
        '¿Estás seguro de eliminar este Item? Esta acción es irreversible.',
      ) === false
    ) {
      return;
    }
    try {
      const response = landingPageApi.deleteLandingPageCarrouselItem(
        landingId,
        id,
        itemId,
      );
      const newItems = editedItems.filter((_, i) => i !== index); // Eliminar el item por índice

      await reOrderItems(newItems);
      setItemOrder(newItems.length + 1);
      setMaxOrder(newItems.length + 1);

      toast.success('Item elimnado correctamente.');
      resetsetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Guardar cambios
  const handleSaveChanges = () => {
    carrouseltData.button_id = carrouselButtomId;
    carrouseltData.background_color = hexadecimal;
    carrouseltData.background_url = fileBG[0];
    carrouseltData.is_mobile = 0;
    if (isMobile === true) carrouseltData.is_mobile = 1;
    carrouseltData.is_tablet = 0;
    if (isTablet === true) carrouseltData.is_tablet = 1;
    onEdit(carrouseltData); // Guardar cambios en los ítems
    handleClose();
  };

  const handleChangeColorHex = (hex) => {
    setHexadecimal(hex);
    carrouseltData.background_color = hex;
  };

  useEffect(() => {
    if (isHexColor(imageBack)) setHexadecimal(imageBack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateItemOrders = async (currentOrder, newOrder, itemId) => {
    let itemsToUpdate = [];

    if (newOrder < currentOrder) {
      // Si el nuevo orden es menor, incrementamos los órdenes de los items en el rango afectado
      itemsToUpdate = editedItems
        .filter((item) => item.order >= newOrder && item.order < currentOrder)
        .map((item) => ({ ...item, order: parseInt(item.order, 10) + 1 }));
    } else if (newOrder > currentOrder) {
      // Si el nuevo orden es mayor, decrementamos los órdenes de los items en el rango afectado
      itemsToUpdate = editedItems
        .filter((item) => item.order <= newOrder && item.order > currentOrder)
        .map((item) => ({ ...item, order: parseInt(item.order, 10) - 1 }));
    }

    // Actualizar los items en la API y en el estado local
    await Promise.all(
      itemsToUpdate.map((item) =>
        landingPageApi.updateLandingPageCarrouselItem(landingId, id, item.id, {
          order: item.order,
        }),
      ),
    );

    // Actualizar el item principal con el nuevo orden
    await landingPageApi.updateLandingPageCarrouselItem(landingId, id, itemId, {
      order: newOrder,
    });

    // Actualizar el estado local para reflejar todos los cambios
    setEditedItems(
      (prevItems) =>
        prevItems
          .map(
            (item) =>
              item.id === itemId
                ? { ...item, order: newOrder } // El item movido tiene el nuevo orden
                : itemsToUpdate.find(
                    (updatedItem) => updatedItem.id === item.id,
                  ) || item, // Los items actualizados mantienen su orden
          )
          .sort((a, b) => a.order - b.order), // Reordenar para evitar duplicados
    );
  };

  const handleSaveItemCarrousel = async () => {
    let newItem = {};
    newItem.carrousel_landing_id = id;
    newItem.link = itemUrl;
    newItem.url = file[0];
    newItem.order = itemOrder;
    newItem.button_id = itemButtom;

    newItem.is_mobile = 0;
    if (isMobileItem === true) newItem.is_mobile = 1;
    newItem.is_tablet = 0;
    if (isTabletItem === true) newItem.is_tablet = 1;

    if (itemId === null) {
      newItem.order = editedItems.length + 1;
    }

    let cambiaOrden = 1;
    const existingItem = editedItems.find((item) => itemId == item.id);
    if (existingItem && existingItem.order !== newItem.order) {
      // Llamamos a la función para actualizar los órdenes antes de actualizar el ítem
      await updateItemOrders(existingItem.order, newItem.order, itemId);
    } else {
      cambiaOrden = 0;
    }

    if (itemId == null) {
      document.getElementById('submitButton').textContent = 'Guardando Ítem...';
      const response = await landingPageApi.createLandingPageCarrouselItem(
        landingId,
        id,
        newItem,
      );
      const newItems = [...editedItems];

      if (response?.is_mobile == '0') response.is_mobile = 0;
      if (response?.is_mobile == '1') response.is_mobile = 1;

      if (response?.is_tablet == '0') response.is_tablet = 0;
      if (response?.is_tablet == '1') response.is_tablet = 1;

      if (response && response.data) newItems.push(response.data);
      else {
        toast.error('Error al crear el item.');
        resetsetForm();
        return false;
      }

      if (cambiaOrden === 0) {
        await setEditedItems(newItems);
      }

      setItemOrder(newItems.length + 1);
      setMaxOrder(newItems.length + 1);

      toast.success('Item agregado correctamente.');
      resetsetForm();
      document.getElementById('submitButton').textContent = 'Guardar Ítem';
    } else {
      document.getElementById('submitButton').textContent =
        'Actualizando Ítem...';
      const response = await landingPageApi.updateLandingPageCarrouselItem(
        landingId,
        id,
        itemId,
        newItem,
      );

      if (response?.is_mobile == '0') response.is_mobile = 0;
      if (response?.is_mobile == '1') response.is_mobile = 1;

      if (response?.is_tablet == '0') response.is_tablet = 0;
      if (response?.is_tablet == '1') response.is_tablet = 1;

      const updatedItems = editedItems.map((item) =>
        item.id === itemId ? { ...item, ...response } : item,
      );

      if (cambiaOrden === 0) {
        await setEditedItems(updatedItems);
      }

      setItemOrder(updatedItems.length + 1);
      setMaxOrder(updatedItems.length + 1);

      toast.success('Item modificado correctamente.');
      resetsetForm();
      const inputElement = document.getElementById(itemId); // Asegúrate de que el ID coincida con el input
      if (inputElement) {
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCancelEdit = useCallback(() => {
    resetsetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetsetForm = useCallback(() => {
    setItemId(null);
    setItemButton('');
    setItemUrl('');
    setFile([]);
    setIsMobileItem(false);
    setIsTabletItem(false);
    document.getElementById('submitButton').textContent = 'Guardar Ítem';
    document.getElementById('formTitle').textContent = 'Nuevo Item';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //funcion para editar item
  const handleSetFormEditItem = (index) => {
    resetsetForm();
    const newItems = [...editedItems];
    newItems[index];
    setItemUrl(newItems[index].link);
    setItemOrder(newItems[index].order);
    setItemId(newItems[index].id);
    setItemButton(newItems[index].button_id);

    if (newItems[index].is_mobile == 1) setIsMobileItem(true);
    if (newItems[index].is_tablet == 1) setIsTabletItem(true);

    document.getElementById('formTitle').textContent = `Editando el ítem ${
      index + 1
    }`;
    document.getElementById('submitButton').textContent = 'Actualizar Ítem';

    const inputElement = document.getElementById('itemUrlInput'); // Asegúrate de que el ID coincida con el input
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setMaxOrder(editedItems.length);
  };

  useEffect(() => {
    const sortedItems = [...(editedItems || [])].sort(
      (a, b) => a.order - b.order,
    );
    setEditedItems(sortedItems);
    setItemOrder(editedItems?.length + 1);
    setMaxOrder(editedItems?.length + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <Box
      sx={{
        p: 2,
        position: 'relative',
        backgroundColor: isHexColor(imageUrl) ? `${imageUrl}` : 'transparent',
        backgroundImage: isImageUrl(imageUrl) ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 350,
      }}
    >
      {/* Botón para abrir el modal de edición */}
      {editable && (
        <>
          <IconButton
            onClick={handleOpen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1044,
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
              zIndex: 1044,
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
              zIndex: 1044,
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

      {/* Slider */}
      {editedItems && editedItems?.length > 0 ? (
        editedItems?.length > 2 ? (
          <Box>
            <Slider {...settings}>
              {editedItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{ px: 1, borderRadius: 0, position: 'relative' }}
                >
                  <a
                    href={item.button?.url}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                    }}
                  >
                    <Card sx={{ borderRadius: 0 }}>
                      <CardMedia
                        component="img"
                        image={item.url || '/assets/errors/error-404.png'}
                        alt="carrousel item"
                      />
                      {/* Contenedor del botón/enlace */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          p: 1,
                        }}
                      >
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            href={item.button.url}
                            style={{
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              fontWeight: 500,
                              fontSize: '1rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <span
                            href={item.button.url}
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
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </span>
                        )}
                      </Box>
                    </Card>
                  </a>
                </Box>
              ))}
            </Slider>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'left',
                p: 1,
              }}
            >
              {carrouselButtom && carrouselButtom.type === 'button' && (
                <button
                  type="button"
                  href={carrouselButtom.url}
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    color: 'black',
                    lineHeight: '1.25rem',
                    padding: '0.5rem 1rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  {button.title}
                </button>
              )}
              {carrouselButtom && carrouselButtom.type === 'link' && (
                <a
                  href={carrouselButtom.url}
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
                  {button?.title}
                </a>
              )}
            </Box>
          </Box>
        ) : (
          editedItems.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.url || '/assets/errors/error-404.png'}
                    alt="carrousel item"
                  />
                  <Typography>{item.title}</Typography>
                </Card>
              </Grid>
            </Grid>
          ))
        )
      ) : (
        <Typography>No hay items creados en el Carrousel.</Typography>
      )}

      {/* Modal único para editar todos los ítems y el orden */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Editar Carrusel</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item marginTop={1.5} xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Boton"
                select
                SelectProps={{ native: true }}
                value={carrouselButtomId || 'Sin Boton'}
                onChange={(event) => setCarrouselmButtonId(event.target.value)}
              >
                <option>Sin Boton</option>
                {buttons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.url})
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography fontSize={12}>Color de fondo</Typography>
              <Grid container spacing={2}>
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
              <Typography marginLeft={1} fontSize={12}>
                Imagen de fondo Tipo:{' '}
                {isMobile ? 'Móvil' : isTablet ? 'Tablet' : 'Ordenador'}
              </Typography>
              {isImageUrl(imageUrl) && (
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
                  onDrop={handleDropBG}
                  onRemove={handleRemoveBG}
                  onRemoveAll={handleRemoveAllBG}
                  onUpload={handleFilesUploadBG}
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

          <Card>
            <CardHeader
              title="Items"
              titleTypographyProps={{ variant: 'subtitle2' }}
            />
            <Divider />
            <CardContent>
              {editedItems && editedItems.length > 0 ? (
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {editedItems.map((item, index) => (
                    <Grid id={item.id} item xs={12} md={6} key={index}>
                      <Box sx={{ mb: 3, position: 'relative' }}>
                        <Typography variant="subtitle1">
                          Item {index + 1}
                        </Typography>
                        <Typography variant="subtitle2">
                          Orden: {item.order || ''} Tipo:{' '}
                          {item.is_mobile === 1
                            ? 'Móvil'
                            : item.is_tablet === 1
                            ? 'Tablet'
                            : 'Ordenador'}
                        </Typography>
                        <Typography variant="subtitle3">
                          Título Link: {item.button?.title || ''} Link:{' '}
                          {item.button?.url || ''}
                        </Typography>

                        {/* Mostrar la imagen cargada o una imagen por defecto */}
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.url || '/assets/errors/error-404.png'}
                          alt="carrousel item"
                          sx={{ mb: 1 }}
                        />

                        {/* Botón para editar y eliminar el item */}
                        <IconButton
                          onClick={() => handleSetFormEditItem(index)}
                          sx={{
                            position: 'absolute',
                            color: 'rgba(0, 0, 0, 0.3)',
                            top: 0,
                            right: 30,
                            '&:hover': {
                              color: 'rgba(0, 0, 0, 0.5)', // Oscurece el fondo al pasar el cursor
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteItem(index, item.id)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: 'rgba(255, 0, 0, 0.7)',
                            '&:hover': {
                              color: 'red',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No hay items creados en el Carrousel.</Typography>
              )}
              <Grid container spacing={2}>
                <Divider />
                <Grid item xs={12}>
                  <Typography id="formTitle" variant="subtitle1">
                    Nuevo Item
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="itemUrlInput"
                    fullWidth
                    margin="dense"
                    label="Link"
                    select
                    SelectProps={{ native: true }}
                    value={itemButtom || 'Sin Link'}
                    onChange={(event) => setItemButton(event.target.value)}
                  >
                    <option>Sin Link</option>
                    {links.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} ({item.url}) ({item.type})
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="dense"
                    name="itemOrder"
                    label="Orden"
                    placeholder="Orden"
                    type="number"
                    value={itemOrder}
                    inputProps={{
                      min: 1,
                      max: maxOrder,
                    }}
                    fullWidth
                    onChange={(event) => setItemOrder(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Stack spacing={2}>
                    <FileDropzone
                      accept={{ 'image/*': [] }}
                      caption="(SVG, JPG, PNG, o GIF)"
                      files={file}
                      maxFiles={1}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      onUpload={handleFilesUpload}
                      hideUploadButton={true}
                    />
                  </Stack>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Si no selecciona un tamaño, la imagen es para tamaño
                      ordenador
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isMobileItem}
                          onChange={(event, checked) => {
                            setIsMobileItem(checked);
                            if (checked) setIsTabletItem(false);
                          }}
                        />
                      }
                      label="Es móvil"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isTabletItem}
                          onChange={(event, checked) => {
                            setIsTabletItem(checked);
                            if (checked) setIsMobileItem(false);
                          }}
                        />
                      }
                      label="Es tablet"
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                {itemId !== null && (
                  <Button onClick={handleCancelEdit}>Cancelar Edición</Button>
                )}

                <Button
                  id="submitButton"
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveItemCarrousel}
                >
                  Guardar Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
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
