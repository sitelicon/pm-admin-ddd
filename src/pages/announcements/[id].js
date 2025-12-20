import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { announcementsApi } from '../../api/announcements';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useRouter } from 'next/router';
import { useLanguages } from '../../hooks/use-languages';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';

const useAnnouncement = (announcementId) => {
  const isMounted = useMounted();
  const [announcement, setAnnouncement] = useState({
    id: 1,
    language: 'EN',
    message: 'This is my message',
    is_active: true,
    created_at: new Date(),
  });

  const getAnnouncement = useCallback(
    async (id) => {
      try {
        const response = await announcementsApi.getAnnouncement(id);

        if (isMounted()) {
          setAnnouncement(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getAnnouncement(announcementId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [announcementId],
  );

  return announcement;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const announcement = useAnnouncement(id);
  const [language, setLanguage] = useState(-1);
  const [message, setMessage] = useState();
  const languages = useLanguages();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState();

  usePageView();

  useEffect(() => {
    setLanguage(announcement?.language_id);
    setMessage(announcement?.message);
    setIsActive(announcement.is_active);
  }, [announcement]);

  if (!announcement) {
    return null;
  }

  const createdAt = format(
    new Date(announcement.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await announcementsApi.updateAnnouncement(id, {
        language_id: language,
        is_active: isActive,
        message,
      });
      toast.success('Anuncio actualizado correctamente');
      setError(undefined);
      router.push(`/announcements`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Anuncio # {announcement.id} | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.announcements.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Anuncios</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Anuncio # {announcement.id}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography color="text.secondary" variant="body2">
                    Realizado el
                  </Typography>
                  <SvgIcon color="action">
                    <CalendarIcon />
                  </SvgIcon>
                  <Typography variant="body2">{createdAt}</Typography>
                </Stack>

                <form onSubmit={handleUpdateProduct}>
                  <FormControl fullWidth>
                    <FormLabel
                      sx={{
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      Idioma
                    </FormLabel>
                    <Select
                      fullWidth
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {languages.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    error={!!error}
                    fullWidth
                    label="Mensaje"
                    margin="normal"
                    variant="filled"
                    value={message}
                    multiline
                    onChange={(event) => setMessage(event.target.value)}
                    helperText={error || 'El mensaje es obligatorio'}
                    required
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(event, checked) => setIsActive(checked)}
                      />
                    }
                    label="Visibilidad"
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="large" variant="contained" type="submit">
                      Actualizar
                    </Button>
                  </Box>
                </form>
              </Stack>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
