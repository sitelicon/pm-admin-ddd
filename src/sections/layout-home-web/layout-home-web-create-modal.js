import { useEffect, useState } from 'react';
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { layoutHomeWebApi } from '../../api/layout-home-web';
import { apiRequest } from '../../utils/api-request';
import { useStores } from '../../hooks/use-stores';

export const LayoutHomeWebCreateModal = ({ idHome, open, onClose }) => {
  const router = useRouter();
  const [objectId, setObjectId] = useState();
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState();
  const [storeId, setStoreId] = useState(1);
  const [objectType, setObjectType] = useState();
  const stores = useStores();

  const [items, setItems] = useState([]);

  const getItems = async () => {
    const res = await apiRequest(`admin/${objectType}`, {
      method: 'GET',
      params: {
        allOption: true,
      },
    });
    setItems(res.items);
  };

  useEffect(() => {
    setObjectId(null);
    setItems([]);
    if (objectType) {
      getItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectType]);

  const objectTypes = [
    'slider_layout',
    'banner_text_layout',
    'banner_images_layout',
    'category_layout',
    'blog_layout',
    'instagram_layout',
    'mid_banner',
  ];

  const handleClose = () => {
    setObjectId('');
    setIsActive(false);
    setPosition(0);
    setObjectType('');
    onClose();
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await layoutHomeWebApi.createLayoutHomeWeb({
        object_id: objectId,
        is_active: isActive,
        object_type: objectType,
        store_id: storeId,
        home_web_id: idHome,
        position,
      });
      toast.success('Maquetación Web creado correctamente');
      router.push(`/layout-home-web/${response.id}`);
    } catch (error) {
      console.error(error);
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
                  Añadir al listado
                </Typography>

                <TextField
                  fullWidth
                  label="Posición"
                  type="number"
                  variant="filled"
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  required
                  sx={{ my: 2 }}
                />
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
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                  >
                    {stores.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item.id}>
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
                    Tipo
                  </FormLabel>
                  <Select
                    fullWidth
                    value={objectType}
                    onChange={(e) => setObjectType(e.target.value)}
                  >
                    {objectTypes.map((item, index) => (
                      <MenuItem key={item} value={item}>
                        {item}
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
                    Item
                  </FormLabel>
                  <Select
                    fullWidth
                    disabled={!objectType}
                    value={objectId}
                    onChange={(e) => setObjectId(e.target.value)}
                  >
                    {items.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item.id}>
                        {item.name ?? item.title_admin}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(event, checked) => setIsActive(checked)}
                    />
                  }
                  label="Activado"
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
                  Añadir
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

LayoutHomeWebCreateModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
