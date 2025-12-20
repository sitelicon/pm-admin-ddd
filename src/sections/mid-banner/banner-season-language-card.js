import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { bannerTextLayoutApi } from '../../api/banner-layout';
import { QuillEditor } from '../../components/quill-editor';
import { midBannerApi } from '../../api/midbanner';

const languajesText = [
  {
    id: 1,
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    id: 2,
    name: 'Inglés',
    flag: '🇬🇧',
  },
  {
    id: 3,
    name: 'Francés',
    flag: '🇫🇷',
  },
  {
    id: 4,
    name: 'Portugués',
    flag: '🇵🇹',
  },
  {
    id: 5,
    name: 'Italiano',
    flag: '🇮🇹',
  },
  {
    id: 6,
    name: 'Alemán',
    flag: '🇩🇪',
  },
];

export const BannerSeasonLanguageCard = ({ id, bannerLang }) => {
  const nameObj = languajesText.find((lang) => {
    return lang.id === bannerLang.language_id;
  });
  const [title, setTitle] = useState(bannerLang.title);
  const [subtitle, setSubtitle] = useState(bannerLang.subtitle);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateLanguageItem = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await midBannerApi.updateMidBannerLanguage(bannerLang.id, {
        title: title,
        subtitle: subtitle,
      });
      toast.success('Contenido actualizado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el contenido');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateLanguageItem = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await midBannerApi.createMidBannerLanguage({
        mid_banner_id: bannerLang.id_banner_text_layout,
        language_id: bannerLang.language_id,
        title: title,
        subtitle: subtitle,
      });
      toast.success('Contenido creado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear el contenido');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Grid item key={id} xs={12} sm={6} md={4} lg={4}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">
                {nameObj?.name}
                {nameObj?.flag}
              </Typography>
              <Typography variant="caption" color="text.secondary"></Typography>
            </Stack>
            <Divider />
            <QuillEditor
              onChange={setTitle}
              placeholder="Escriba un título..."
              sx={{ height: 150 }}
              value={title}
              disabled={isUpdating}
            />
            <QuillEditor
              onChange={setSubtitle}
              placeholder="Escriba un contenido..."
              sx={{ height: 300 }}
              value={subtitle}
              disabled={isUpdating}
            />
          </Stack>
        </CardContent>
        <Stack direction="row" justifyContent="center" spacing={2} p={3}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={
              bannerLang.id
                ? handleUpdateLanguageItem
                : handleCreateLanguageItem
            }
            disabled={isUpdating}
          >
            {bannerLang.id
              ? isUpdating
                ? 'Actualizando...'
                : 'Actualizar '
              : isUpdating
              ? 'Creando...'
              : 'Crear'}
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
};

BannerSeasonLanguageCard.propTypes = {
  id: PropTypes.number,
  bannerLang: PropTypes.object.isRequired,
};
