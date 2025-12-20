import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useLanguages } from '../../../../hooks/use-languages';
import { midBannerApi } from '../../../../api/midbanner';
import { SketchPicker } from 'react-color';
import { BannerSeasonLanguageCard } from '../../../../sections/mid-banner/banner-season-language-card';

const useMidSeasonLayout = (midId) => {
  const isMounted = useMounted();
  const [bannerMidSeasonLayout, setBannerMidSeasonLayout] = useState();

  const getBannerSeasonLayout = useCallback(
    async (id) => {
      try {
        const response = await midBannerApi.getMidSeasonBanner(id);

        if (isMounted()) {
          setBannerMidSeasonLayout(
            Array.isArray(response) ? response[0] : response,
          );
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getBannerSeasonLayout(midId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [midId],
  );

  return { bannerMidSeasonLayout };
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const languages = useLanguages();
  const { bannerMidSeasonLayout } = useMidSeasonLayout(id);

  const [name, setName] = useState(bannerMidSeasonLayout?.title_admin);
  const [hexadecimalBack, setHexadecimalBack] = useState(
    bannerMidSeasonLayout?.hex_background,
  );
  const [hexadecimalText, setHexadecimalText] = useState(
    bannerMidSeasonLayout?.hex_title,
  );

  useEffect(() => {
    setName(bannerMidSeasonLayout?.title_admin);
    setHexadecimalBack(bannerMidSeasonLayout?.hex_background);
    setHexadecimalText(bannerMidSeasonLayout?.hex_title);
  }, [bannerMidSeasonLayout]);

  const handleChangeColorHexText = (hex) => {
    setHexadecimalText(hex);
  };

  const handleChangeColorHexBack = (hex) => {
    setHexadecimalBack(hex);
  };

  usePageView();

  const handleUpdateSeason = async (event) => {
    event.preventDefault();
    try {
      await midBannerApi.updateMidBanner(id, {
        title_admin: name,
        hex_background: hexadecimalBack,
        hex_title: hexadecimalText,
      });
      toast.success('Banner actualizado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el banner');
    }
  };

  if (!bannerMidSeasonLayout) return null;
  return (
    <>
      <Head>
        <title>
          Diseño Midseason # {bannerMidSeasonLayout?.id} | PACOMARTINEZ
        </title>
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
                href={paths.adminContent.home.bannerText}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">
                  Diseño del Season Banner
                </Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del Season Banner # {bannerMidSeasonLayout.id}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography color="text.secondary" variant="body2">
                    Realizado el
                  </Typography>
                  <SvgIcon color="action">
                    <CalendarIcon />
                  </SvgIcon>
                  <Typography variant="body2">
                    {bannerMidSeasonLayout.createdAt}
                  </Typography>
                </Stack>

                <form onSubmit={handleUpdateSeason}>
                  <TextField
                    fullWidth
                    label="Nombre interno"
                    variant="filled"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <Stack
                    direction={'row'}
                    alignContent={'center'}
                    gap={2}
                    justifyContent={'space-between'}
                  >
                    <Box textAlign={'center'}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Color de fondo
                      </Typography>
                      <SketchPicker
                        color={hexadecimalBack}
                        disableAlpha
                        onChange={({ hex }) => handleChangeColorHexBack(hex)}
                        onChangeComplete={({ hex }) =>
                          handleChangeColorHexBack(hex)
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: hexadecimalBack,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          color: hexadecimalText,
                        }}
                      >
                        Esto es un texto de ejemplo
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          color: hexadecimalText,
                        }}
                      >
                        Esto es un contenido de ejemplo
                      </Typography>
                      <Link
                        color={hexadecimalText}
                        component={NextLink}
                        href={'/'}
                        variant="subtitle2"
                      >
                        Link
                      </Link>
                    </Box>
                    <Box textAlign={'center'}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Color de texto
                      </Typography>
                      <SketchPicker
                        color={hexadecimalText}
                        disableAlpha
                        onChange={({ hex }) => handleChangeColorHexText(hex)}
                        onChangeComplete={({ hex }) =>
                          handleChangeColorHexText(hex)
                        }
                      />
                    </Box>
                  </Stack>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}
                  >
                    <Button size="large" variant="contained" type="submit">
                      Actualizar
                    </Button>
                  </Box>
                </form>
              </Stack>
              <Box>
                {' '}
                <Typography variant="h5">Traducciones del contenido</Typography>
              </Box>
              <Stack container spacing={2} marginY={2}>
                {languages.map((language, index) => {
                  const bannerLanguaje = bannerMidSeasonLayout.languages?.find(
                    (p) => p.language_id === language.id,
                  ) || {
                    id_banner_text_layout: bannerMidSeasonLayout.id,
                    language_id: language.id,
                    title: '',
                    subtitle: '',
                  };
                  return (
                    <BannerSeasonLanguageCard
                      key={index}
                      id={bannerLanguaje.id}
                      bannerLang={bannerLanguaje}
                    />
                  );
                })}
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
