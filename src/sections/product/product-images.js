import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { X } from '@untitled-ui/icons-react';
import { FileDropzone } from '../../components/file-dropzone';
import { productsApi } from '../../api/products';
import { useAuth } from '../../hooks/use-auth';

const IMAGE_TAGS = [
  'PRINCIPAL',
  'THUMBNAIL',
  'CROQUIS',
  'CARACTERÍSTICAS',
  'COLOR',
];

export const ProductImages = ({ product, refetch = () => {} }) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState(
    product.images
      ? product.images.sort((a, b) => a.priority - b.priority)
      : [],
  );
  const [actualiza, setActualiza] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [imageDrawer, setImageDrawer] = useState(false);
  const [bulkDelete, setBulkDelete] = useState([]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleFilesUpload = useCallback(async () => {
    try {
      setUploadingFiles(true);
      const response = await productsApi.uploadImages(product.id, files);
      toast.success('Las imágenes se han cargado correctamente.');
      refetch?.();
    } catch (error) {
      console.error(error);
      toast.error('Ha ocurrido un error al cargar las imágenes.');
    } finally {
      setUploadingFiles(false);
    }
  }, [refetch, product.id, files]);

  const handleUpdateImage = useCallback(async (image) => {
    try {
      setUpdating(true);
      await productsApi.updateImage(image.id, {
        url: image.url,
        priority: image.priority,
        hidden: image.hidden,
        tag: image.tag,
      });
      toast.success('La imagen se ha actualizado correctamente.');
      setImages((prevImages) =>
        prevImages
          .map((prevImage) => (prevImage.id === image.id ? image : prevImage))
          .sort((a, b) => a.priority - b.priority),
      );
    } catch (error) {
      console.error(error);
      toast.error('Ha ocurrido un error al actualizar la imagen.');
    } finally {
      setUpdating(false);
    }
  }, []);

  const handleUpdateImagePriority = useCallback(async () => {
    try {
      setUpdating(true);
      const imagesUpdated = images.map((image, index) => ({
        id: image.id,
        priority: index,
      }));
      await productsApi.updateImagePriority(imagesUpdated);
      toast.success('El orden se ha actualizado correctamente.');
    } catch (error) {
      console.error(error);
      toast.error('Ha ocurrido un error al actualizar el orden.');
    } finally {
      setUpdating(false);
    }
  }, [images]);

  const handleDeleteImage = useCallback(async (imageId) => {
    if (
      window.confirm(
        '¿Estás seguro de querer eliminar esta imagen? Esta acción es irreversible.',
      )
    ) {
      try {
        setDeletingImage(true);
        await productsApi.deleteImage(imageId);
        toast.success('La imagen se ha eliminado correctamente.');
        setImages((prevImages) =>
          prevImages.filter(
            (image) => image.id.toString() !== imageId.toString(),
          ),
        );
      } catch (error) {
        console.error(error);
        toast.error('Ha ocurrido un error al eliminar la imagen.');
      } finally {
        setDeletingImage(false);
      }
    }
  }, []);

  const handleBulkDeleteImages = useCallback(async () => {
    if (
      window.confirm(
        '¿Estás seguro de querer eliminar estas imágenes? Esta acción es irreversible.',
      )
    ) {
      try {
        setDeletingImage(true);
        bulkDelete.forEach(async (imageId) => {
          await productsApi.deleteImage(imageId);
        });
        toast.success('Las imágenes se han eliminado correctamente.');
        setImages((prevImages) =>
          prevImages.filter(
            (image) => !bulkDelete.includes(image.id.toString()),
          ),
        );
        setBulkDelete([]);
      } catch (error) {
        console.error(error);
        toast.error('Ha ocurrido un error al eliminar las imágenes.');
      } finally {
        setDeletingImage(false);
      }
    }
  }, [bulkDelete]);

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      const imageIndex = images[oldIndex];
      setImageDrawer(imageIndex);
      setOpenDrawer(true);
    } else {
      setActualiza(true);
      setImages((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const SortableList = SortableContainer(
    ({ items, updating, onDeleteImage, onUpdateImage, deleting }) => {
      return (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {items.map((image, index) => (
            <ProductImage
              key={image.id}
              index={index}
              sortIndex={index}
              image={image}
              onDeleteImage={onDeleteImage}
              onUpdateImage={onUpdateImage}
              updating={updating}
              deleting={deleting}
              openDrawer={openDrawer}
              imageDrawer={imageDrawer}
              setOpenDrawer={setOpenDrawer}
              bulkDelete={bulkDelete}
              setBulkDelete={setBulkDelete}
            />
          ))}
        </Grid>
      );
    },
  );

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h6">Cargar imágenes</Typography>
              <Typography color="text.secondary" variant="body2">
                Las imágenes aparecerán en el escaparate de su sitio web.
              </Typography>
            </Stack>
            <Divider />
            <FileDropzone
              accept={{ 'image/*': [] }}
              caption="(SVG, JPG, PNG, o GIF)"
              files={files}
              onDrop={handleFilesDrop}
              onRemove={handleFileRemove}
              onRemoveAll={handleFilesRemoveAll}
              onUpload={handleFilesUpload}
              uploading={uploadingFiles}
            />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexGrow={3}
            >
              <Stack spacing={1}>
                <Typography variant="h6">Imágenes del producto</Typography>
                <Typography color="text.secondary" variant="body2">
                  Haga clic en una imagen para editar sus detalles.
                </Typography>
              </Stack>
              <Grid container justifyContent="flex-end">
                <Button
                  //fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleUpdateImagePriority}
                  disabled={!user.role.can_edit}
                  // disabled={
                  //   loadingCategories ||
                  //   updatingAttributes ||
                  //   updatingCategories ||
                  //   updatingStores
                  // }
                >
                  Guardar Ordenamiento
                </Button>
              </Grid>
              <Chip
                label={product.images.length}
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              />
              <Grid
                container
                justifyContent={
                  bulkDelete.length > 0 ? 'space-between' : 'flex-end'
                }
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUpdateImagePriority}
                  disabled={updating || !user.role.can_edit}
                >
                  {updating ? 'Guardando cambios…' : 'Guardar cambios'}
                </Button>
                {bulkDelete.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleBulkDeleteImages}
                    disabled={!user.role.can_edit}
                  >
                    Eliminar imágenes
                  </Button>
                )}
              </Grid>
            </Stack>
            <Divider />
            <Grid container spacing={2}>
              <SortableList
                axis="xy"
                items={images}
                onSortEnd={handleSortEnd}
                helperClass="sortable-helper"
                lockToContainerEdges
                useWindowAsScrollContainer
                onDeleteImage={handleDeleteImage}
                onUpdateImage={handleUpdateImage}
                updating={updating}
                deleting={deletingImage}
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
              />
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

const ProductImage = SortableElement(
  ({
    sortIndex,
    image,
    onDeleteImage,
    onUpdateImage,
    updating = false,
    deleting = false,
    openDrawer,
    imageDrawer,
    setOpenDrawer,
    bulkDelete,
    setBulkDelete,
  }) => {
    const [tag, setTag] = useState(imageDrawer.tag || '');
    const [priority, setPriority] = useState(imageDrawer.priority);
    const [hidden, setHidden] = useState(imageDrawer.hidden || false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <>
        <Grid
          tabIndex={sortIndex}
          item
          key={image.id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          onDoubleClick={() => {
            setOpenDrawer(true);
          }}
        >
          <Box
            position="relative"
            sx={{ cursor: 'pointer', position: 'relative' }}
          >
            <Box
              padding={1}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={1}
              >
                <Box padding={0.5}>
                  <Grid container spacing={0.5}>
                    {image.tag && (
                      <Grid item>
                        <Chip
                          label={image.tag}
                          size="small"
                          color="default"
                          sx={{
                            backgroundColor: 'background.paper',
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                          }}
                          variant="filled"
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
                <Checkbox
                  checked={bulkDelete.includes(image.id)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setBulkDelete((prev) => [...prev, image.id]);
                    } else {
                      setBulkDelete((prev) =>
                        prev.filter((id) => id !== image.id),
                      );
                    }
                  }}
                />
              </Stack>
            </Box>
            <Stack spacing={2}>
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  backgroundImage: `url(${image.url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 0,
                  display: 'flex',
                  height: 200,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: '100%',
                }}
              />
            </Stack>
          </Box>
        </Grid>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          PaperProps={{ sx: { width: '80%' } }}
        >
          <Stack direction="row" flexGrow={1} spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'neutral.50',
                  backgroundImage: `url(${imageDrawer.url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 0,
                  display: 'flex',
                  height: '100%',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: '100%',
                }}
              />
            </Stack>
            <Stack padding={2} minWidth={300} maxWidth={450}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="h6">
                    Gestionar detalles de la imágen
                  </Typography>
                  <IconButton onClick={() => setOpenDrawer(false)}>
                    <SvgIcon>
                      <X />
                    </SvgIcon>
                  </IconButton>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Visibilidad</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Ocultar
                    </Typography>
                    <Switch
                      checked={!hidden}
                      color="success"
                      onChange={() => setHidden((prev) => !prev)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Mostrar
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Puede elegir ocultar o no la imágen de la galería de
                    imágenes del producto en la tienda.
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Etiqueta</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Asigne una etiqueta a la imágen para organizarla en la
                    galería de imágenes del producto en la tienda.
                  </Typography>
                  <TextField
                    hiddenLabel
                    name="tag"
                    variant="filled"
                    select
                    SelectProps={{ native: true }}
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                  >
                    <option value="">Ninguna</option>
                    {IMAGE_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </TextField>
                  {tag === 'CARACTERÍSTICAS' && (
                    <div>Selecciona la característica que desea mostrar</div>
                  )}
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    Posición de la imágen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modifique la posición en la que se mostrará la imagen en la
                    galería de la página de producto en la tienda.
                  </Typography>
                  <TextField
                    error={priority < 0}
                    helperText={
                      priority < 0 && 'La posición debe ser mayor o igual a 0'
                    }
                    label="Posición"
                    name="position"
                    size="small"
                    type="number"
                    variant="filled"
                    value={priority}
                    onChange={(event) =>
                      setPriority(parseInt(event.target.value, 10))
                    }
                  />
                </Stack>
                <Button
                  variant="outlined"
                  onClick={() => {
                    onUpdateImage({
                      ...imageDrawer,
                      priority,
                      hidden,
                      tag: tag.length > 0 ? tag : null,
                    });
                    setOpenDrawer(false);
                  }}
                  disabled={updating || deleting}
                >
                  {updating ? 'Guardando cambios…' : 'Guardar cambios'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onDeleteImage(imageDrawer.id)}
                  disabled={updating || deleting}
                >
                  {deleting ? 'Eliminando imagen…' : 'Eliminar imagen'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Drawer>
      </>
    );
  },
);
