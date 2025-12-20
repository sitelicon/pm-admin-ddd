import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { usePageView } from '../hooks/use-page-view';
import { paths } from '../paths';

const PageRoot = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  paddingTop: 80,
  paddingBottom: 80,
});

const ErrorCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '2px solid #e5e7eb',
  borderRadius: 4,
  padding: theme.spacing(6),
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
}));

const ErrorCode = styled(Typography)({
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700,
  fontSize: '4rem',
  color: '#000000',
  lineHeight: 1,
  marginBottom: 16,
  letterSpacing: '-0.05em',
});

const Page = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  usePageView();

  return (
    <>
      <Head>
        <title>Error: Fallo del Servidor | PACOMARTINEZ</title>
      </Head>
      <PageRoot>
        <Container maxWidth="lg">
          <ErrorCard>
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                alt="Internal server error"
                component="img"
                src="/assets/errors/error-500.png"
                sx={{
                  height: 'auto',
                  maxWidth: '100%',
                  width: 200,
                }}
              />
            </Box>

            <ErrorCode variant="h1">500</ErrorCode>

            <Typography
              align="center"
              variant="h5"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                color: '#111827',
                mb: 2,
              }}
            >
              Error Interno del Servidor
            </Typography>

            <Typography
              align="center"
              color="text.secondary"
              sx={{
                mb: 4,
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                maxWidth: 380,
              }}
            >
              El servidor ha encontrado una situación inesperada que le impidió
              completar la solicitud. Por favor, inténtalo de nuevo más tarde.
            </Typography>

            <Button
              component={NextLink}
              href={paths.index}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 1, // 4px
                textTransform: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                px: 4,
                '&:hover': {
                  backgroundColor: '#333333',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Volver al Dashboard
            </Button>

            <Typography
              variant="caption"
              sx={{
                mt: 4,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#9ca3af',
              }}
            >
              ERR_INTERNAL_SERVER_ERROR
            </Typography>
          </ErrorCard>
        </Container>
      </PageRoot>
    </>
  );
};

export default Page;
