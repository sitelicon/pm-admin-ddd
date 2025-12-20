import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import { useLanguageId } from '../../hooks/use-language-id';
import { featuresApi } from '../../api/features';
import toast from 'react-hot-toast';

export const FeatureEditForm = ({ feature, refetch }) => {
  const languageId = useLanguageId();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (feature) {
      setName(feature.name);
      const data = feature.data.find(
        ({ language_id }) => language_id === languageId,
      );
      setTitle(data?.title || '');
      setBody(data?.body || '');
    }
  }, [feature, languageId]);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        await featuresApi.updateFeature(feature.id, {
          name,
          data: [
            ...feature.data.filter(
              ({ language_id }) => language_id !== languageId,
            ),
            { language_id: languageId, feature_id: feature.id, title, body },
          ],
        });
        toast.success('Los cambios se han guardado correctamente.');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error('No se pudo guardar los cambios.');
      } finally {
        setLoading(false);
      }
    },
    [body, feature, languageId, name, refetch, title],
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader
          title="Datos de la característica"
          subheader="Modifique los datos de la característica para los distintos lenguajes disponibles. Puede cambiar de lenguaje en la barra superior."
        />
        <CardContent sx={{ py: 0 }}>
          <TextField
            fullWidth
            label="Nombre administrativo"
            margin="normal"
            onChange={(event) => setName(event.target.value)}
            value={name}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Título web"
            margin="normal"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Contenido web"
            margin="normal"
            multiline
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            value={body}
            disabled={loading}
          />
        </CardContent>
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Guardando cambios…' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Card>
    </form>
  );
};

FeatureEditForm.propTypes = {
  feature: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
