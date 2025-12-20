import Head from 'next/head';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GuestGuard } from '../../guards/guest-guard';
import { IssuerGuard } from '../../guards/issuer-guard';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as AuthLayout } from '../../layouts/auth/classic-layout';
import { Issuer } from '../../utils/auth';
import { authApi } from '../../api/auth';

const initialValues = {
  email: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .max(255)
    .required('El correo electrónico es obligatorio'),
});

const Page = () => {
  const isMounted = useMounted();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const res = await authApi.forgotPassword({ email: values.email });

        if (isMounted()) {
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  usePageView();

  return (
    <>
      <Head>
        <title>Restablecer contraseña | PACOMARTINEZ</title>
      </Head>
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Te enviaremos un correo electrónico con un enlace para
                restablecer tu contraseña si tu cuenta existe.
              </Typography>
            }
            sx={{ pb: 0, textAlign: 'center' }}
            title="Restablecer contraseña"
          />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              {formik.errors.submit && (
                <FormHelperText error sx={{ mb: 2 }}>
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                {formik.isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>

              {formik.status?.success && (
                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                  variant="body2"
                >
                  Si tu cuenta existe, te hemos enviado un correo electrónico
                  con un enlace para restablecer tu contraseña.
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.JWT}>
    <GuestGuard>
      <AuthLayout>{page}</AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
