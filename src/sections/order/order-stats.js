import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { SeverityPill } from '../../components/severity-pill';

export const OrderStats = ({ totalOrders = 0, newOrders = 0, refunds = 0 }) => (
  <Box
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100',
      p: 3,
    }}
  >
    <Card>
      <Grid
        container
        sx={{
          '& > *:not(:last-of-type)': {
            borderRight: (theme) => ({
              md: `1px solid ${theme.palette.divider}`,
            }),
            borderBottom: (theme) => ({
              xs: `1px solid ${theme.palette.divider}`,
              md: 'none',
            }),
          },
        }}
      >
        <Grid xs={12} sm={6} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography
              color="text.secondary"
              component="h2"
              variant="overline"
            >
              Pedidos totales
            </Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="h5">
                {totalOrders.toLocaleString('es-ES')}
              </Typography>
              <SeverityPill color="success">+16%</SeverityPill>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography
              color="text.secondary"
              component="h5"
              variant="overline"
            >
              Nuevos pedidos
            </Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="h5">
                {newOrders.toLocaleString('es-ES')}
              </Typography>
              <SeverityPill color="success">+4%</SeverityPill>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography
              color="text.secondary"
              component="h2"
              variant="overline"
            >
              Devoluciones
            </Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="h5">
                {refunds.toLocaleString('es-ES')}
              </Typography>
              <SeverityPill color="error">-1%</SeverityPill>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  </Box>
);

OrderStats.propTypes = {
  newOrders: PropTypes.number,
  refunds: PropTypes.number,
  totalOrders: PropTypes.number,
};
