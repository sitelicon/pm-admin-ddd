import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { attributesApi } from '../../api/attributes';
import { useLanguages } from '../../hooks/use-languages';
import { getLangFlag } from '../../utils/get-lang-flag';

const ignoreIDs = [
  77, // comentario
  78,
  79,
  80,
  81,
  101,
  102,
  103,
  104,
  114,
  117,
  151,
  158,
  206,
  249,
  252,
  253,
  254,
  258,
  266,
  276,
  279,
];

const useAttributes = (excludeIds) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const getAttributes = useCallback(
    async () => {
      try {
        const attributes = await attributesApi.getAttributes();
        setAttributes(
          attributes
            .filter((attribute) => !ignoreIDs.includes(attribute.id))
            .filter((attribute) => !excludeIds.includes(attribute.id))
            .map((attribute) => ({
              id: attribute.id,
              code: attribute.code,
              type: attribute.tipo,
              options: attribute.attribute_options,
              label:
                attribute.labels.find(({ language_id }) => language_id === 1)
                  ?.label ||
                attribute.labels[0]?.label ||
                attribute.code,
            })),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => {
      getAttributes();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    attributes,
    loading,
    error,
  };
};

export const ProductAttributeCreate = ({
  product,
  open = false,
  onClose,
  onCreate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const languages = useLanguages();
  const { attributes } = useAttributes(
    product.attributes.map((attribute) => attribute.id),
  );
  const [selected, setSelected] = useState(undefined);
  const [language, setLanguage] = useState(languages[0]?.id);
  const [value, setValue] = useState('');

  const handleSelectAttribute = (event) => {
    const attributeId = event.target.value;
    const attribute = attributes.find((attr) => attr.id === attributeId);
    setSelected(attribute);
    setValue('');
  };

  const handleValueChange = (event) => {
    if (!selected) return;
    setValue(event.target.value);
  };

  const handleFormSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await attributesApi.createProductAttribute({});
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Añadir atributo</Typography>
                <Typography variant="body2">
                  Selecciona un atributo de la lista para añadirlo al producto.
                </Typography>
                <TextField
                  fullWidth
                  label="Atributo"
                  select
                  value={selected?.id || ''}
                  onChange={handleSelectAttribute}
                  required
                >
                  {attributes
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((attribute) => (
                      <MenuItem key={attribute.id} value={attribute.id}>
                        {attribute.label}
                      </MenuItem>
                    ))}
                </TextField>
                {!!selected && (
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      Selecciona el idioma para el atributo.
                    </Typography>
                    <TextField
                      fullWidth
                      label="Idioma"
                      select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      required
                    >
                      {languages.map((language) => (
                        <MenuItem key={language.id} value={language.id}>
                          {getLangFlag(language.iso)} {language.language} (
                          {language.iso})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                )}
                {selected?.type === 'STRING' && (
                  <>
                    <Typography variant="body2">
                      Introduce el valor del atributo.
                    </Typography>
                    <TextField
                      fullWidth
                      label={selected.code.toUpperCase()}
                      onChange={handleValueChange}
                      value={value}
                      helperText={error || ''}
                      error={!!error}
                      required
                    />
                  </>
                )}
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button color="inherit" onClick={onClose} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Añadiendo atributo…' : 'Añadir atributo'}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

ProductAttributeCreate.propTypes = {
  product: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
};
