import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Grid,
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import { popupsApi } from '../../api/popups';

export const PopupImages = ({ item, refetch }) => {
  const [desktopURL, setDesktopURL] = useState(item.source_desktop);
  const [mobileURL, setMobileURL] = useState(item.source_mobile);
  const [desktopFile, setDesktopFile] = useState();
  const [mobileFile, setMobileFile] = useState();

  const handleChangeImageDesktop = (e) => {
    setDesktopFile(e.target.files[0]);
    setDesktopURL(URL.createObjectURL(e.target.files[0]));
  };

  const handleChangeImageMobile = (e) => {
    setMobileFile(e.target.files[0]);
    setMobileURL(URL.createObjectURL(e.target.files[0]));
  };

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const handleAddOrUpdateImages = async () => {
    try {
      setUpdating(true);
      if (
        item.source_desktop !== null &&
        item.source_mobile !== null &&
        (desktopFile || mobileFile)
      ) {
        const obj = {
          source_desktop: desktopFile,
          source_mobile: mobileFile,
        };
        await popupsApi.updateImage(item.id, obj).then(() => {
          toast.success('Imagenes actualizadas');
          refetch();
        });
      } else {
        if (desktopFile || mobileFile) {
          const obj = {
            source_desktop: desktopFile,
            source_mobile: mobileFile,
          };
          await popupsApi.updateImage(item.id, obj).then(() => {
            toast.success('Imagenes actualizadas');
            refetch();
          });
        } else {
          toast.error('No fue posible actualizar las imágenes');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('No fue posible actualizar las imágenes');
      setError({
        state: true,
        message: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        {error.state && (
          <Grid container justifyContent="center">
            <Grid>
              <Box sx={{ color: 'error.main' }}>{error.message}</Box>
            </Grid>
          </Grid>
        )}
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Imágen de escritorio"
                  subheader="Agrega o edita la imágen de escritorio"
                />
                <Divider />
                <CardContent>
                  <Stack
                    direction={'column'}
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={desktopURL ?? item.source_desktop}
                      alt={item.title}
                      sx={{
                        position: 'relative',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                      }}
                      height="100%"
                    />
                    <Button component="label" variant="outlined">
                      {item.source_desktop !== null ? 'Cambiar' : 'Añadir'}
                      <input
                        style={{
                          clip: 'rect(0 0 0 0)',
                          clipPath: 'inset(50%)',
                          height: 1,
                          overflow: 'hidden',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          whiteSpace: 'nowrap',
                          width: 1,
                        }}
                        type="file"
                        name="[src]"
                        onChange={handleChangeImageDesktop}
                      />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Imágen de móvil"
                  subheader="Agrega o edita la imágen de móvil"
                />
                <Divider />
                <CardContent>
                  <Stack
                    direction={'column'}
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={mobileURL ?? item.source_mobile}
                      alt={item.title}
                      sx={{
                        position: 'relative',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                      }}
                      height="100%"
                    />
                    <Button component="label" variant="outlined">
                      {item.source_mobile !== null ? 'Cambiar' : 'Añadir'}
                      <input
                        style={{
                          clip: 'rect(0 0 0 0)',
                          clipPath: 'inset(50%)',
                          height: 1,
                          overflow: 'hidden',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          whiteSpace: 'nowrap',
                          width: 1,
                        }}
                        type="file"
                        name="[src]"
                        onChange={handleChangeImageMobile}
                      />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Stack>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleAddOrUpdateImages}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Actualizar imagenes'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};
