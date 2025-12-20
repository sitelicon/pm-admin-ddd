import toast from 'react-hot-toast';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CardHeader,
  Divider,
  CardContent,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileDropzone } from '../../components/file-dropzone';
import { landingPageApi } from '../../api/landing-page';

export const LandingBoxes = ({
  type,
  items,
  editable,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  id,
  landingId,
  buttons,
}) => {
  // Estado para controlar la apertura del modal y la edición
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(type);
  const [editedItems, setEditedItems] = useState(items);
  const [itemId, setItemId] = useState(null);
  const [itemButtom, setItemButton] = useState();
  const [itemUrl, setItemUrl] = useState('');
  const [itemOrderBox, setitemOrderBox] = useState(editedItems?.length + 1);
  const [file, setFile] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const [maxOrder, setMaxOrder] = useState(editedItems?.length + 1);

  const resetsetForm = useCallback(() => {
    setItemId(null);
    setItemButton(null);
    setItemUrl('');
    setFile([]);
    setIsMobile(false);
    setIsTablet(false);
    document.getElementById('submitButton').textContent = 'Guardar Ítem';
    document.getElementById('formTitle').textContent = 'Nuevo Item';
    //console.log(editedItems.length+1);
  }, []);

  const handleDrop = useCallback((newFile) => {
    setFile(newFile);
  }, []);

  const handleRemove = useCallback(() => {
    setFile([]);
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFile([]);
  }, []);

  // Funciones para abrir y cerrar el modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Manejar cambios en el tipo (flex o list)
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  //funcion para editar item
  const handleSetFormEditItem = (index) => {
    resetsetForm();
    const newItems = [...editedItems];
    newItems[index];
    setItemUrl('');
    setItemButton(newItems[index].button_id);
    setitemOrderBox(newItems[index].order);
    setItemId(newItems[index].id);
    if (newItems[index].is_tablet == 1) setIsTablet(true);
    if (newItems[index].is_mobile == 1) setIsMobile(true);

    document.getElementById('formTitle').textContent = `Editando ítem ${
      index + 1
    }`;
    document.getElementById('submitButton').textContent = 'Actualizar Ítem';

    const inputElement = document.getElementById('itemUrlInput'); // Asegúrate de que el ID coincida con el input
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setMaxOrder(editedItems.length);
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
        landingPageApi.updateLandingPageBoxItem(landingId, id, item.id, {
          order: item.order,
        }),
      ),
    );

    // Actualiza el estado local con los nuevos órdenes
    setEditedItems(reorderedItems);
  };

  // Función para eliminar un item
  const handleDeleteItem = async (index, itemId) => {
    if (
      window.confirm(
        '¿Estás seguro de eliminar este Item? Esta acción es irreversible.',
      ) === false
    ) {
      return;
    }
    try {
      landingPageApi.deleteLandingPageBoxItem(landingId, id, itemId);
      const newItems = editedItems.filter((_, i) => i !== index);
      await reOrderItems(newItems);
      setitemOrderBox(newItems.length + 1);
      setMaxOrder(newItems.length + 1);
      toast.success('Item eliminado correctamente.');
      resetsetForm();
    } catch (error) {
      console.error(error);
      //toast.error('Error al modificar la Landing Page.');
    }
  };

  // Guardar los cambios
  const handleSaveChanges = () => {
    onEdit({ type: selectedType, items: editedItems });
    handleClose();
  };

  const handleCancelEdit = useCallback(() => {
    resetsetForm();
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
        landingPageApi.updateLandingPageBoxItem(landingId, id, item.id, {
          order: item.order,
        }),
      ),
    );

    // Actualizar el item principal con el nuevo orden
    await landingPageApi.updateLandingPageBoxItem(landingId, id, itemId, {
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

  const normalizeItemData = (item) => {
    return {
      ...item,
      is_mobile: item?.is_mobile === '1' ? 1 : 0,
      is_tablet: item?.is_tablet === '1' ? 1 : 0,
      order: parseInt(item.order, 10),
    };
  };

  const handleSaveItemBox = async () => {
    let newItem = {
      boxes_landing_id: id,
      button_id: itemButtom,
      link: itemUrl,
      image_url: file[0],
      order: parseInt(itemOrderBox, 10),
      is_mobile: isMobile ? 1 : 0,
      is_tablet: isTablet ? 1 : 0,
    };

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
      //creo un nuevo item

      document.getElementById('submitButton').textContent = 'Guardando Ítem...';
      let response = await landingPageApi.createLandingPageBoxItem(
        landingId,
        id,
        newItem,
      );
      const newItems = [...editedItems];

      response = normalizeItemData(response);

      newItems.push(response);

      setitemOrderBox(newItems.length + 1);
      setMaxOrder(newItems.length + 1);
      if (cambiaOrden === 0) await setEditedItems(newItems);
      toast.success('Item agregado correctamente.');
      resetsetForm();
      document.getElementById('submitButton').textContent = 'Guardar Ítem';
    } else {
      //actualizo item
      document.getElementById('submitButton').textContent =
        'Actualizando Ítem...';
      let response = await landingPageApi.updateLandingPageBoxItem(
        landingId,
        id,
        itemId,
        newItem,
      );

      const updatedItems = editedItems.map((item) =>
        item.id == itemId ? { ...item, ...response } : item,
      );

      toast.success('Item modificado correctamente.');
      resetsetForm();
      setitemOrderBox(updatedItems.length + 1);
      setMaxOrder(updatedItems.length + 1);

      if (cambiaOrden === 0) {
        await setEditedItems(updatedItems);
      }

      const inputElement = document.getElementById(itemId);
      if (inputElement) {
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleFilesUpload = useCallback(async () => {}, []);

  useEffect(() => {
    const sortedItems = [...editedItems].sort((a, b) => a.order - b.order);
    setEditedItems(sortedItems);
    setitemOrderBox(editedItems?.length + 1);
    setMaxOrder(editedItems?.length + 1);
  }, [editedItems, items]);

  const itemsMobile = editedItems.filter((item) => item.is_mobile === 1);
  const itemsTablet = editedItems.filter((item) => item.is_tablet === 1);
  const itemsDesktop = editedItems.filter(
    (item) => item.is_tablet === 0 && item.is_mobile === 0,
  );

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      {/* Botón para abrir el modal de edición */}
      {editable && (
        <>
          <IconButton
            onClick={handleClickOpen}
            sx={{
              position: 'absolute',
              color: 'rgba(0, 0, 0, 0.5)',
              top: 8,
              zIndex: 1200,
              right: 8,
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
              zIndex: 1200,
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
              zIndex: 1200,
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

      {/* Renderizado del grid o lista según el tipo */}
      {editedItems && editedItems.length > 0 ? (
        selectedType === 'list' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="column" gap={1}>
              <Typography variant="h5">Móvil</Typography>
              <Grid container direction={'row'} spacing={2}>
                {itemsMobile.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0, maxHeight: '340px' }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h5">Tablet</Typography>
              <Grid container spacing={2}>
                {itemsTablet.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0, maxHeight: '340px' }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h5">Desktop</Typography>
              <Grid container spacing={2}>
                {itemsDesktop.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0, maxHeight: '340px' }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="column" gap={1}>
              <Typography variant="h5">Móvil</Typography>
              <Grid container direction={'row'} spacing={2}>
                {itemsMobile.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0 }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h5">Tablet</Typography>
              <Grid container spacing={2}>
                {itemsTablet.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0 }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h5">Desktop</Typography>
              <Grid container spacing={2}>
                {itemsDesktop.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    key={index}
                    sx={{ borderRadius: 0 }}
                  >
                    <a
                      //href={item.button?.url}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <Card sx={{ position: 'relative', borderRadius: 0 }}>
                        <CardMedia
                          component="img"
                          sx={{ borderRadius: 0 }}
                          image={
                            item.image_url || '/assets/errors/error-404.png'
                          }
                          alt="box item"
                        />
                        {item.button && item.button.type === 'button' && (
                          <button
                            type="button"
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '80%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el botón
                              border: '1px solid black',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              color: 'black',
                              lineHeight: '1.25rem',
                              padding: '0.5rem 1rem',
                              margin: '0',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            {item.button.title}
                          </button>
                        )}
                        {item.button && item.button.type === 'link' && (
                          <a
                            //href={item.button.url}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)', // Centrar el enlace
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
                          </a>
                        )}
                      </Card>
                    </a>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>
        )
      ) : (
        <Typography>No hay items creados en el Box.</Typography>
      )}

      {/* Modal (Dialog) */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Editar Box</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ mt: 1.5 }}>Tipo de Layout</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              <MenuItem value="flex">Flex</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>

          <Card>
            <CardHeader
              title="Items"
              titleTypographyProps={{ variant: 'subtitle2' }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {editedItems?.map((item, index) => (
                  <Grid id={item.id} item xs={12} md={6} key={index}>
                    <Box sx={{ mb: 3, position: 'relative' }}>
                      <Typography variant="subtitle1">
                        Item {index + 1}
                      </Typography>
                      <Typography variant="subtitle2">
                        Orden: {item.order || ''} Tipo :{' '}
                        {item.is_mobile === 1
                          ? 'Móvil'
                          : item.is_tablet === 1
                          ? 'Tablet'
                          : 'Ordenador'}
                      </Typography>
                      <Typography variant="subtitle3">
                        Título del botón: {item.button?.title || ''} URL:{' '}
                        {item.button?.url || ''}
                      </Typography>

                      {/* Mostrar la imagen cargada o una imagen por defecto */}
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image_url || '/assets/errors/error-404.png'}
                        alt="box item"
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
              <Grid container spacing={2}>
                <Divider />
                <Grid item xs={12}>
                  <Typography id="formTitle" variant="subtitle1">
                    Nuevo Item
                  </Typography>
                </Grid>
                {/*
                <Grid item xs={12} md={4}>
                  <TextField
                    id="itemUrlInput"
                    margin="dense"
                    name="itemUrl"
                    label="URL"
                    placeholder="Sin URL"
                    type="text"
                    fullWidth
                    onChange={(event) => setItemUrl(event.target.value)}
                    value={itemUrl}
                  />
                </Grid>
                */}
                <Grid item xs={12} md={6}>
                  <TextField
                    id="itemUrlInput"
                    fullWidth
                    margin="dense"
                    label="Boton"
                    select
                    SelectProps={{ native: true }}
                    value={itemButtom || 'Sin Boton'}
                    onChange={(event) => setItemButton(event.target.value)}
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
                  <TextField
                    margin="dense"
                    name="itemOrderBox"
                    label="Orden"
                    placeholder="Orden"
                    type="number"
                    value={itemOrderBox}
                    inputProps={{
                      min: 1,
                      max: maxOrder,
                    }}
                    fullWidth
                    onChange={(event) => setitemOrderBox(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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

              <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                {itemId !== null && (
                  <Button onClick={handleCancelEdit}>Cancelar Edición</Button>
                )}

                <Button
                  id="submitButton"
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveItemBox}
                >
                  Guardar Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="primary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleSaveChanges}
            >
              Guardar Cambios del Box
            </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                onDelete();
                handleClose();
              }}
            >
              Eliminar Box
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
