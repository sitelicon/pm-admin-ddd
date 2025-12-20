import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
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
import { Layout as AuthLayout } from '../../layouts/auth/classic-layout';
import { Issuer } from '../../utils/auth';
import { authApi } from '../../api/auth';
import { useRouter } from 'next/router';

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/auth/login';
  const token = searchParams.get('token') || undefined;

  return {
    returnTo,
    token,
  };
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .max(255)
    .required('El correo electrónico es obligatorio'),
  password: Yup.string().max(255).required('La contraseña es obligatoria'),
  passwordConfirmation: Yup.string()
    .max(255)
    .required('La confirmación de la contraseña es obligatoria'),
});

const Page = () => {
  const router = useRouter();
  const { token, returnTo } = useParams();
  const isMounted = useMounted();

  const initialValues = {
    email: '',
    password: '',
    passwordConfirmation: '',
    submit: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (values.password !== values.passwordConfirmation) {
          helpers.setErrors({
            passwordConfirmation: 'Las contraseñas no coinciden',
          });
          return;
        }

        await authApi.resetPassword({
          token,
          email: values.email,
          password: values.password,
          confirm_password: values.passwordConfirmation,
        });

        if (isMounted()) {
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          router.push(returnTo || paths.index);
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

  return (
    <>
      <Head>
        <title>Cambio de contraseña | PACOMARTINEZ</title>
      </Head>
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Introduce tu correo electrónico y la nueva contraseña. Tras el
                proceso, podrás iniciar sesión con tu nueva contraseña.
              </Typography>
            }
            sx={{ pb: 0, textAlign: 'center' }}
            title="Cambio de contraseña"
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
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={
                    !!(
                      formik.touched.passwordConfirmation &&
                      formik.errors.passwordConfirmation
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.passwordConfirmation &&
                    formik.errors.passwordConfirmation
                  }
                  label="Confirmar contraseña"
                  name="passwordConfirmation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.passwordConfirmation}
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
                  Hemos procedido a cambiar tu contraseña. Puedes iniciar sesión
                  con tu nueva contraseña.
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
