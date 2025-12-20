import { useCallback, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { paths } from '../../paths';
import { wait } from '../../utils/wait';
import { apiRequest } from '../../utils/api-request';
import { customersApi } from '../../api/customers';

const groupOptions = [
  {
    id: '1',
    name: 'Fidelizado',
  },
  {
    id: '2',
    name: 'Empleado',
  },
  {
    id: '3',
    name: 'Invitado',
  },
];

export const CustomerEditForm = (props) => {
  const { customer, refetch, ...other } = props;
  const [updatingPoints, setUpdatingPoints] = useState(false);
  const [points, setPoints] = useState(0);
  const [pointsUpdateReason, setPointsUpdateReason] = useState('');
  const formik = useFormik({
    initialValues: {
      birth_date: customer.birth_date
        ? new Date(customer.birth_date)
        : undefined,
      email: customer.email || '',
      group_id: customer.group_id.toString() || '',
      name: customer.name || '',
      last_name: customer.last_name || '',
      phone: customer.phone || '',
      submit: null,
    },
    validationSchema: Yup.object({
      birth_date: Yup.date().nullable(),
      email: Yup.string()
        .email('Debe ser un email válido')
        .max(255)
        .required('El email es obligatorio'),
      group_id: Yup.string().max(255).required('El grupo es obligatorio'),
      name: Yup.string().max(255).required('El nombre es obligatorio'),
      last_name: Yup.string().max(255).required('El apellido es obligatorio'),
      phone: Yup.string().max(15),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await customersApi.updateCustomerById(customer.id, {
          birth_date: values.birth_date
            ? moment(values.birth_date).format('YYYY-MM-DD')
            : null,
          email: values.email,
          group_id: values.group_id,
          name: values.name,
          last_name: values.last_name,
          phone: values.phone,
        });
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Cliente actualizado');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error(err.message);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleUpdateRewardPoints = useCallback(async () => {
    try {
      if (points === 0) {
        toast.error(
          'Debes introducir una cantidad de puntos a incrementar o decrementar',
        );
        return;
      }
      if (!pointsUpdateReason || pointsUpdateReason.trim() === '') {
        toast.error('Debes introducir una razón para actualizar los puntos');
        return;
      }
      setUpdatingPoints(true);
      const response = await apiRequest(
        `admin/customers/${customer.id}/updateRewardPoints`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            reward_points: points,
            comment: pointsUpdateReason,
          }),
        },
      );
      toast.success('Puntos actualizados');
      setPoints(0);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('¡Algo ha ido mal!');
    } finally {
      setUpdatingPoints(false);
    }
  }, [customer.id, points, pointsUpdateReason, refetch]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} {...other}>
        <Card>
          <CardHeader title="Editar datos del cliente" />
          <CardContent sx={{ py: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nombre"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={
                    !!(formik.touched.last_name && formik.errors.last_name)
                  }
                  fullWidth
                  helperText={
                    formik.touched.last_name && formik.errors.last_name
                  }
                  label="Apellidos"
                  name="last_name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.last_name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Dirección de email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Grupo"
                  name="group_id"
                  onChange={formik.handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.group_id}
                >
                  {groupOptions.map((groupOption) => (
                    <option key={groupOption.id} value={groupOption.id}>
                      {groupOption.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Número de teléfono"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <DatePicker
                  clearable
                  format="dd/MM/yyyy"
                  label="Fecha de nacimiento"
                  name="birth_date"
                  onBlur={formik.handleBlur}
                  onChange={(value) =>
                    formik.setFieldValue('birth_date', value)
                  }
                  renderInput={(params) => <TextField {...params} />}
                  value={formik.values.birth_date}
                  slotProps={{
                    textField: {
                      error: !!(
                        formik.touched.birth_date && formik.errors.birth_date
                      ),
                      helperText:
                        formik.touched.birth_date && formik.errors.birth_date,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            flexWrap="wrap"
            spacing={2}
            sx={{ p: 3 }}
          >
            <Button
              disabled={formik.isSubmitting || updatingPoints}
              type="submit"
              variant="contained"
            >
              Actualizar datos del cliente
            </Button>
            <Button
              color="inherit"
              component={NextLink}
              disabled={formik.isSubmitting}
              href={`/customers/${customer.id}`}
            >
              Cancelar
            </Button>
          </Stack>
        </Card>
      </form>
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Editar puntos de recompensa" />
        <CardContent sx={{ py: 0 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth={false}
              label="Puntos del cliente"
              name="points"
              type="number"
              value={customer.reward_points}
              disabled
            />
            <TextField
              fullWidth={false}
              label="Puntos a incrementar o decrementar"
              name="points"
              onChange={(event) => setPoints(event.target.value)}
              helperText="Escriba la cantidad de puntos a incrementar o decrementar (puede ser negativo)"
              required
              type="number"
              value={points}
            />
            <TextField
              fullWidth
              label="Motivo"
              name="pointsUpdateReason"
              placeholder="Escriba el motivo por el cual se actualizan los puntos"
              onChange={(event) => setPointsUpdateReason(event.target.value)}
              required
              value={pointsUpdateReason}
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </CardContent>
        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          flexWrap="wrap"
          spacing={2}
          sx={{ p: 3 }}
        >
          <Button
            disabled={formik.isSubmitting || updatingPoints}
            type="button"
            variant="contained"
            onClick={handleUpdateRewardPoints}
          >
            {updatingPoints
              ? 'Actualizando puntos…'
              : 'Actualizar puntos de recompensa'}
          </Button>
          <Button
            color="inherit"
            component={NextLink}
            disabled={formik.isSubmitting}
            href={`/customers/${customer.id}`}
          >
            Cancelar
          </Button>
        </Stack>
      </Card>
    </>
  );
};

CustomerEditForm.propTypes = {
  customer: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
