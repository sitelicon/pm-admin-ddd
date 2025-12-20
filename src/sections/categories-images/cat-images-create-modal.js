import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  FormLabel,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { storesApi } from '../../api/stores';
import { buttonApi } from '../../api/button';
import { categoriesApi } from '../../api/categories';

const useButtons = (search) => {
  const [state, setState] = useState({
    buttons: [],
    buttonsCount: 0,
    loading: true,
  });

  const getButtons = useCallback(async () => {
    try {
      const response = await buttonApi.getButtons({
        allOption: true,
      });

      setState({
        buttons: response.items,
        buttonsCount: response.pagination.totalItems,
        loading: false,
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      console.error(err);
    }
  }, []);

  useEffect(
    () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      getButtons();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  return {
    buttons: state.buttons,
    buttonsCount: state.buttonsCount,
    loading: state.loading,
    getButtons,
  };
};

const useStore = () => {
  const [state, setState] = useState({
    stores: [],
    loadingStores: true,
  });

  const getStores = async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingStores: true,
      }));

      const res = await storesApi.getStores();

      setState({
        stores: res,
        loadingStores: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingStores: false,
      }));
    }
  };

  useEffect(() => {
    getStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

export const CategoriesImagesCreateModal = ({
  open,
  onClose,
  categoryId,
  refresh,
}) => {
  const [data, setData] = useState({
    button_id: '',
    category_id: categoryId,
    store_id: '',
    display_order: 0,
    tag: '',
  });
  const [file, setFile] = useState();
  const handleChangeImage = (e) => {
    setFile(e.target.files[0]);
  };
  const [error, setError] = useState(undefined);
  const { stores } = useStore();
  const { buttons } = useButtons();

  const handleClose = () => {
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await categoriesApi.createImageCategory({
        ...data,
        image: file,
      });
      if (response.status !== 200) {
        toast.error(
          'Error al crear la imagen de la categoría, por favor intente nuevamente.',
        );
      }
      setError(undefined);
      handleClose();
      refresh();
    } catch (error) {
      setError(error.message);
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
          <form onSubmit={handleCreateProduct}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Crear imagen para categoría
                </Typography>
                <Button component="label" variant="contained">
                  {file ? 'Cambiar' : 'Añadir imagen'}
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
                {file && (
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt="Imagen de categoría"
                    sx={{
                      mt: 2,
                      width: '100%',
                      height: 'auto',
                      maxHeight: 300,
                      objectFit: 'cover',
                      marginBottom: 2,
                    }}
                  />
                )}
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Tienda
                  </FormLabel>
                  <Select
                    fullWidth
                    value={data.store_id}
                    onChange={(e) =>
                      setData({ ...data, store_id: e.target.value })
                    }
                  >
                    {stores.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Botón
                  </FormLabel>
                  <Select
                    fullWidth
                    value={data.button_id}
                    onChange={(e) =>
                      setData({ ...data, button_id: e.target.value })
                    }
                  >
                    {buttons.map((item, index) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title} - {item.url}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  error={!!error}
                  fullWidth
                  label="Orden de visualización"
                  margin="normal"
                  variant="filled"
                  value={data.display_order}
                  multiline
                  onChange={(event) =>
                    setData({
                      ...data,
                      display_order: event.target.value,
                    })
                  }
                  helperText={error || 'El orden es obligatorio'}
                  required
                />
                <TextField
                  error={!!error}
                  fullWidth
                  label="Titulo de la imagen"
                  margin="normal"
                  variant="filled"
                  value={data.tag}
                  multiline
                  onChange={(event) =>
                    setData({
                      ...data,
                      tag: event.target.value,
                    })
                  }
                  helperText={error || 'El título es obligatorio'}
                  required
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
                  type="submit"
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

CategoriesImagesCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
