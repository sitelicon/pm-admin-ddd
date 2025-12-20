import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  FormControl,
  Switch,
  FormLabel,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
import { QuillEditor } from '../../components/quill-editor';
import { helpCenterApi } from '../../api/help-center';
import { CreateEditHelpCenterItemModal } from './create-item-modal';
import { Delete } from '@mui/icons-material';
import { tenants } from '../../utils/tenants';

const HelpItem = ({ item, setError }) => {
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle);
  const [order, setOrder] = useState(item.order);
  const [isOpenDefault, setIsOpenDefault] = useState(item.is_open_default);

  const handleUpdateDetails = async () => {
    try {
      setUpdating(true);
      await helpCenterApi.updateHelpCenterItem(item.id, {
        order,
        title,
        subtitle,
        is_open_default: isOpenDefault,
        help_center_id: item.help_center_id,
        language_id: item.language_id,
      });
      toast.success('Detalles actualizados');
    } catch (error) {
      console.error(error);
      toast.error('No fue posible actualizar los detalles');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteHelpCenterItem = async () => {
    try {
      await helpCenterApi.deleteHelpCenterItem(item.id);
      toast.success('Artículo eliminado');
    } catch (error) {
      console.error(error);
      toast.error('No fue posible eliminar el artículo');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };
  return (
    <Card>
      <CardHeader
        title="Detalles del artículo"
        subheader="Agrega y edita detalles del artículo"
        action={
          <IconButton aria-label="remove" onClick={handleDeleteHelpCenterItem}>
            <Delete />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Posición del artículo"
            name="order"
            type="number"
            onChange={(e) => setOrder(e.target.value)}
            required
            value={order}
            variant="outlined"
          />
          <TextField
            label="Título del artículo"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            required
            value={title}
            variant="outlined"
          />
          <QuillEditor
            onChange={setSubtitle}
            placeholder="Escriba el subtítulo del artículo"
            sx={{ height: 300 }}
            value={subtitle}
          />
          <FormControl>
            <FormLabel sx={{ ml: 1 }} component="legend">
              ¿Está abierto por defecto?
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  sx={{ ml: 1 }}
                  checked={isOpenDefault > 0}
                  onChange={(event) => {
                    setIsOpenDefault(event.target.checked ? 1 : 0);
                  }}
                  name="isOpenDefault"
                />
              }
              label={
                isOpenDefault > 0 ? 'Artículo abierto por defecto' : 'Cerrado'
              }
            />
          </FormControl>
        </Stack>
      </CardContent>
      <Divider />
      <Stack spacing={2} sx={{ m: 2 }}>
        <Grid container justifyContent="center">
          <Grid>
            <Button
              sx={{ minWidth: 300 }}
              color="primary"
              variant="contained"
              onClick={handleUpdateDetails}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Actualizar articulo'}
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

export const HelpCenterItems = ({ items, item, refetch }) => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const tienda = tenants.find((t) => t.id === item.store_id)?.store;
  const lang = tenants.find((t) => t.id === item.language_id)?.label;
  const [error, setError] = useState({
    state: false,
    message: '',
  });

  return (
    <>
      <Stack spacing={2}>
        {error.state && (
          <Grid container justifyContent="center">
            <Grid>
              <Box sx={{ color: 'error.main' }}>{error.message}</Box>
            </Grid>
          </Grid>
        )}
        <Stack
          sx={{ mb: 2 }}
          alignItems={'end'}
          justifyContent={'space-between'}
          direction={'row'}
          spacing={2}
        >
          <Box>
            <Typography variant="h6">Artículos del centro de ayuda</Typography>
            <Typography variant="body2">
              Estás en la tienda {tienda} - {lang}. Si quieres cambiar de idioma
              o tienda, vuelve al listado de centros de ayuda.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreateModal(true)}
          >
            Crear contenedor
          </Button>
          <CreateEditHelpCenterItemModal
            open={openCreateModal}
            data={{
              help_center_id: item.id,
              language_id: item.language_id,
              store_id: item.store_id,
            }}
            onClose={() => setOpenCreateModal(false)}
            refetch={refetch}
          />
        </Stack>
        <Box>
          <Grid container spacing={2}>
            {items.map((item) => {
              return (
                <Grid item xs={12} md={12} key={item.id}>
                  <HelpItem item={item} setError={setError} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Stack>
    </>
  );
};
