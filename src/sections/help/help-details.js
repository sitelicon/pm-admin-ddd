import { useState, useEffect } from 'react';
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
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormLabel,
  FormControlLabel,
  InputAdornment,
  CardMedia,
} from '@mui/material';
import { languagesApi } from '../../api/languages';
import { QuillEditor } from '../../components/quill-editor';
import { helpCenterApi } from '../../api/help-center';
import { useStores } from '../../hooks/use-stores';

const useLang = () => {
  const [state, setState] = useState({
    languages: [],
    loadingLanguages: true,
  });

  const getLanguages = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: true,
      }));

      const res = await languagesApi.getLanguages();

      setState({
        languages: res,
        loadingLanguages: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingLanguages: false,
      }));
    }
  };

  useEffect(() => {
    getLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

export const HelpCenterDetails = ({ item, refetch }) => {
  const { languages } = useLang();
  const stores = useStores();
  const [order, setOrder] = useState(item.order);
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle);
  const [is_active, setIs_active] = useState(item.is_active);
  const [slug, setSlug] = useState(item.slug);
  const [language_id, setLanguage_id] = useState(item.language_id);
  const [store_id, setStore_id] = useState(item.store_id);
  const [imageURL, setImageURL] = useState();
  const [file, setFile] = useState();
  const handleChangeImage = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const handleUpdateDetails = async () => {
    try {
      setUpdating(true);
      await helpCenterApi.updateHelpCenter(item.id, {
        order: Number(order),
        title,
        subtitle,
        is_active,
        slug,
        language_id,
        store_id,
      });
      toast.success('Detalles actualizados');
      refetch();
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

  const handleAddOrUpdateIcon = async () => {
    try {
      setUpdating(true);
      if (item.icon !== null && file) {
        const obj = {
          icon: file,
        };
        await helpCenterApi.updateIconHelpCenter(item.id, obj).then(() => {
          toast.success('Detalles actualizados');
          refetch();
        });
      } else {
        if (file) {
          const obj = {
            icon: file,
          };
          await helpCenterApi.uploadIconHelpCenter(item.id, obj).then(() => {
            toast.success('Detalles actualizados');
            refetch();
          });
        } else {
          toast.error('No fue posible actualizar el icono');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('No fue posible actualizar el icono');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

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
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Card>
                <CardHeader
                  title="Detalles de la página"
                  subheader="Agrega y edita detalles de la página"
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Posición de la página en el menú"
                      name="order"
                      onChange={(e) => setOrder(e.target.value)}
                      required
                      value={order}
                      variant="outlined"
                    />

                    <TextField
                      label="Dirección de la página"
                      name="slug"
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      value={slug}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            pacomartinez.com
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                    <TextField
                      label="Título de la página"
                      name="title"
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      value={title}
                      variant="outlined"
                    />
                    <QuillEditor
                      onChange={setSubtitle}
                      placeholder="Escriba el subtítulo de la página, si lo hubiera."
                      sx={{ height: 300 }}
                      value={subtitle}
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Tienda</InputLabel>
                      {languages && (
                        <Select
                          value={store_id}
                          label="Tienda"
                          onChange={(event) => setStore_id(event.target.value)}
                        >
                          <MenuItem key={0} value={0}>
                            Selecciona una tienda
                          </MenuItem>
                          {stores.map((store) => (
                            <MenuItem key={store.id} value={store.id}>
                              {store.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <FormControl fullWidth required>
                      <InputLabel>Idioma</InputLabel>
                      {languages && (
                        <Select
                          value={language_id}
                          label="Idioma"
                          onChange={(event) =>
                            setLanguage_id(event.target.value)
                          }
                        >
                          <MenuItem key={0} value={''}>
                            Selecciona un idioma
                          </MenuItem>
                          {languages.map((language) => (
                            <MenuItem key={language.id} value={language.id}>
                              {language.language}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel sx={{ ml: 1 }} component="legend">
                        Visibilidad de la página
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            sx={{ ml: 1 }}
                            checked={is_active > 0}
                            onChange={(event) => {
                              setIs_active(event.target.checked ? 1 : 0);
                            }}
                            name="is_active"
                          />
                        }
                        label={is_active > 0 && 'Página visible'}
                      />
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardHeader
                  title="Icono de la página"
                  subheader="Agrega o edita el icono de la página"
                />
                <Divider />
                <CardContent>
                  <Stack
                    direction={'column'}
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageURL ?? item.icon}
                      alt={item.title}
                      sx={{
                        position: 'relative',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                      }}
                      height="100%"
                    />
                    <Button component="label" variant="outlined">
                      {item.icon !== null ? 'Cambiar' : 'Añadir'}
                      <input
                        style={{
                          clip: 'rect(0 0 0 0)',
                          clipPath: 'inset(50%)',
                          height: 1,
                          overflow: 'hidden',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          whiteSpace: 'nowrap',
                          width: 1,
                        }}
                        type="file"
                        name="[src]"
                        onChange={handleChangeImage}
                      />
                    </Button>
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      onClick={handleAddOrUpdateIcon}
                      disabled={updating}
                    >
                      {updating ? 'Actualizando...' : 'Actualizar icono'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container justifyContent="center">
              <Grid>
                <Button
                  sx={{ minWidth: 300 }}
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateDetails}
                  disabled={updating}
                >
                  {updating ? 'Actualizando...' : 'Actualizar detalles'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};
