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
  TextField,
  Typography,
} from '@mui/material';
import { bannerTextLayoutApi } from '../../api/banner-layout';
import { QuillEditor } from '../../components/quill-editor';

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

export const BannerItemLanguageCard = ({
  id,
  bannerLang,
  isVisually = false,
}) => {
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
      await bannerTextLayoutApi.updateItemLanguage(bannerLang.id, {
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
      await bannerTextLayoutApi.createItemLanguage({
        id_banner_text_layout: bannerLang.id_banner_text_layout,
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
    <Grid item key={id} xs={12} sm={6} md={6} lg={6}>
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
            <TextField
              fullWidth
              label="Título"
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              disabled={isVisually}
            />
            <QuillEditor
              value={subtitle}
              onChange={setSubtitle}
              disabled={isVisually}
              placeholder="Subtítulo..."
              sx={{ height: 200 }}
            />
          </Stack>
        </CardContent>
        {!isVisually && (
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
        )}
      </Card>
    </Grid>
  );
};

BannerItemLanguageCard.propTypes = {
  id: PropTypes.number,
  bannerLang: PropTypes.object.isRequired,
  isVisually: PropTypes.bool,
};
