import { useCallback, useState } from 'react';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useStores } from '../../hooks/use-stores';
import { productsApi } from '../../api/products';
import { toast } from 'react-hot-toast';
import { SeverityPill } from '../../components/severity-pill';
import { useAuth } from '../../hooks/use-auth';

const ProductPrice = ({ store, defaultPrice, refetch }) => {
  const { user } = useAuth();
  const [price, setPrice] = useState(defaultPrice);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePrice = useCallback(async () => {
    try {
      setIsUpdating(true);
      await productsApi.updateProductPrice({
        ...price,
        price_discount: !!price.price_discount ? price.price_discount : null,
        price_discount_start:
          price.price_discount_start?.trim().length > 0 &&
          price.price_discount_start !== 'Invalid date'
            ? price.price_discount_start
            : null,
        price_discount_end:
          price.price_discount_end?.trim().length > 0 &&
          price.price_discount_end !== 'Invalid date'
            ? price.price_discount_end
            : null,
      });
      toast.success('Precio actualizado');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el precio');
    } finally {
      setIsUpdating(false);
    }
  }, [price, refetch]);

  return (
    <Grid item key={store.id} xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">{store.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {store.code.toUpperCase()}
              </Typography>
            </Stack>
            <Divider />
            <ListItem
              onClick={() =>
                setPrice((prev) => ({
                  ...prev,
                  ignore_updates: !prev.ignore_updates,
                }))
              }
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer',
                },
              }}
            >
              <Checkbox
                checked={price.ignore_updates}
                color="error"
                icon={<SeverityPill color="success">Si</SeverityPill>}
                checkedIcon={<SeverityPill color="error">No</SeverityPill>}
              />
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={12}
                  >
                    Sincronizaciones automáticas
                  </Typography>
                }
              />
            </ListItem>
            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={price.price}
              onChange={({ target }) =>
                setPrice({ ...price, price: target.value })
              }
            />
            <TextField
              fullWidth
              label="Precio de oferta"
              type="number"
              value={price.price_discount}
              onChange={({ target }) =>
                setPrice({ ...price, price_discount: target.value })
              }
            />
            <DateTimePicker
              clearable
              format="dd/MM/yyyy HH:mm"
              label="Oferta a partir del"
              onChange={(value) =>
                setPrice({
                  ...price,
                  price_discount_start: moment(value).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                })
              }
              renderInput={(params) => <TextField {...params} />}
              value={
                price.price_discount_start
                  ? new Date(price.price_discount_start)
                  : null
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DateTimePicker
              clearable
              format="dd/MM/yyyy HH:mm"
              label="Oferta hasta el"
              onChange={(value) =>
                setPrice({
                  ...price,
                  price_discount_end: moment(value).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                })
              }
              renderInput={(params) => <TextField {...params} />}
              value={
                price.price_discount_end
                  ? new Date(price.price_discount_end)
                  : null
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>
        </CardContent>
        <Stack direction="row" justifyContent="center" spacing={2} p={3}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={handleUpdatePrice}
            disabled={isUpdating || !user.role.can_edit}
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar precio'}
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
};

export const ProductPrices = ({ product, refetch }) => {
  const stores = useStores();

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h6">Precios por tienda</Typography>
              <Typography color="text.secondary" variant="body2">
                Gestione los precios del producto para cada una de las tiendas
                online.
              </Typography>
            </Stack>
            <Divider />
            <Box>
              <Grid container spacing={2}>
                {stores.map((store) => {
                  const price = product.prices.find(
                    (p) => p.store_id === store.id,
                  ) || {
                    product_id: product.id,
                    store_id: store.id,
                    price: 0,
                    price_discount: 0,
                    price_discount_start: null,
                    price_discount_end: null,
                  };
                  return (
                    <ProductPrice
                      key={store.id}
                      store={store}
                      defaultPrice={price}
                      refetch={refetch}
                    />
                  );
                })}
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
