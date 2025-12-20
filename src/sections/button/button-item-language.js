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
import { buttonApi } from '../../api/button';

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

export const ButtonItemLanguageCard = ({
  languageId,
  buttonLanguageText,
  buttonId,
}) => {
  const nameObj = languajesText.find((lang) => {
    return lang.id === buttonLanguageText.language_id;
  });
  const [title, setTitle] = useState(buttonLanguageText.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateLanguageButton = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await buttonApi.updateItemLanguage(buttonLanguageText.id, {
        text: title,
      });
      toast.success('Contenido actualizado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el contenido');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateLanguageButton = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await buttonApi.createItemLanguage({
        id_button_item: buttonId,
        language_id: buttonLanguageText.language_id,
        text: title,
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
    <Grid item key={languageId} xs={12} sm={6} md={4} lg={4}>
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
            />
          </Stack>
        </CardContent>
        <Stack direction="row" justifyContent="center" spacing={2} p={3}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={
              buttonLanguageText.id
                ? handleUpdateLanguageButton
                : handleCreateLanguageButton
            }
            disabled={isUpdating}
          >
            {buttonLanguageText.id
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

ButtonItemLanguageCard.propTypes = {
  languageId: PropTypes.number,
  buttonLanguageText: PropTypes.object.isRequired,
  buttonId: PropTypes.number,
};
