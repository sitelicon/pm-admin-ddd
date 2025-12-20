import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  keyframes,
  styled,
} from '@mui/material';
import { GuestGuard } from '../../guards/guest-guard';
import { IssuerGuard } from '../../guards/issuer-guard';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as AuthLayout } from '../../layouts/auth/classic-layout';
import { paths } from '../../paths';
import { AuthFooter } from '../../sections/auth/auth-footer';
import { Issuer } from '../../utils/auth';

// --- ESTILOS PERSONALIZADOS ---

// Animación Ping (Copiada del CSS original)
const ping = keyframes`
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const StatusDotWrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  height: 12,
  width: 12,
  marginRight: 12,
});

const PingDot = styled('span')({
  animation: `${ping} 3s cubic-bezier(0, 0, 0.2, 1) infinite`,
  position: 'absolute',
  display: 'inline-flex',
  height: '100%',
  width: '100%',
  borderRadius: '50%',
  backgroundColor: '#34d399', // emerald-400
  opacity: 0.75,
});

const SolidDot = styled('span')({
  position: 'relative',
  display: 'inline-flex',
  borderRadius: '50%',
  height: 12,
  width: 12,
  backgroundColor: '#10b981', // emerald-500
});

// Input personalizado para que sea más técnico (Borde gris, foco negro)
const TechTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#e5e7eb', // gray-200
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af', // gray-400
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000', // black focus
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#000000',
  },
});

// --- LÓGICA DEL FORMULARIO ---

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;
  return { returnTo };
};

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .max(255)
    .required('El correo electrónico es obligatorio'),
  password: Yup.string().max(255).required('La contraseña es obligatoria'),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { signIn } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email, values.password);
        if (isMounted()) {
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

  usePageView();

  return (
    <>
      <Head>
        <title>Iniciar sesión | PACOMARTINEZ API</title>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Inter:wght@400;600;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div>
        <Card
          elevation={0}
          sx={{
            border: '2px solid #e5e7eb',
            borderRadius: 3,
            boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            backgroundColor: '#f9fafb',
            p: 1,
          }}
        >
          <Box
            sx={{
              p: 3,
              pb: 1,
              borderBottom: '1px solid #e5e7eb',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#d1d5db',
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#d1d5db',
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#d1d5db',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                color: '#6b7280',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ADMINISTRATOR
            </Typography>
          </Box>

          <CardHeader
            subheader={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#374151', fontWeight: 600 }}
                >
                  Administrador de la tienda online
                </Typography>
              </Box>
            }
            sx={{ pb: 0, textAlign: 'center' }}
            title={
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
                  color: '#000',
                }}
              >
                Inicio de sesión
              </Typography>
            }
          />

          <CardContent sx={{ pt: 4 }}>
            <form noValidate onSubmit={formik.handleSubmit}>
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mb: 2, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Error: {formik.errors.submit}
                </FormHelperText>
              )}
              <Stack spacing={3}>
                <TechTextField
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
                  placeholder="user@pacomartinez.com"
                />
                <TechTextField
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
              </Stack>

              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{
                  mt: 4,
                  bgcolor: '#000000',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  height: 48,
                  '&:hover': {
                    bgcolor: '#333333',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  },
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
                type="submit"
                variant="contained"
              >
                {formik.isSubmitting ? (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Iniciando...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#9ca3af',
                  }}
                >
                  // Secure connection v1.0
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <AuthFooter />
        </Stack>
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
