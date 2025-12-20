import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  Divider,
  Paper,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import { useLanguages } from '../../hooks/use-languages';
import { getLangFlag } from '../../utils/get-lang-flag';

export const ProductAttribute = ({ attribute }) => {
  const languages = useLanguages();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]?.id);
  const [value, setValue] = useState(
    attribute.values.find(({ language }) => language.id === selectedLanguage),
  );

  useEffect(() => {
    setValue(
      attribute.values.find(({ language }) => language.id === selectedLanguage),
    );
  }, [attribute, selectedLanguage]);

  return (
    <Paper>
      <ButtonBase
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          p: 2,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <Box
          component="span"
          sx={{
            color: 'var(--nav-item-color)',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
          }}
        >
          {attribute.label}
        </Box>
        <SvgIcon
          sx={{
            color: 'var(--nav-item-chevron-color)',
            fontSize: 16,
            ml: 2,
          }}
        >
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </SvgIcon>
      </ButtonBase>
      <Collapse in={open} sx={{ mt: 0.5 }}>
        <Divider />

        <Stack spacing={1}>
          <div>
            <Tabs
              indicatorColor="primary"
              onChange={(event, newValue) => setSelectedLanguage(newValue)}
              scrollButtons="auto"
              textColor="primary"
              value={selectedLanguage}
              variant="scrollable"
            >
              {languages.map((language) => {
                const hasValue = attribute.values.some(
                  (value) => value.language.id === language.id,
                );
                return (
                  <Tab
                    key={language.id}
                    label={`${getLangFlag(language.iso)} ${
                      language.language
                    } (${language.iso}) ${hasValue ? '✅' : '❌'}`}
                    value={language.id}
                    sx={{
                      px: '12px',
                    }}
                  />
                );
              })}
            </Tabs>
            <Divider />
          </div>
        </Stack>
        <Box sx={{ px: 3, pb: 3 }}>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Valor del atributo"
              multiline={attribute.type === 'TEXT'}
              onChange={(event) => setValue(event.target.value)}
              rows={4}
              value={value?.value || ''}
            />
          </Stack>
          {/* Show buttons to update or delete the selected attribute */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mt: 2 }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => {}}
              sx={{ px: 2.5 }}
            >
              {value ? 'Actualizar' : 'Agregar'}
            </Button>
            <Button
              color="error"
              variant="text"
              onClick={() => {}}
              sx={{ px: 2.5 }}
            >
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

ProductAttribute.propTypes = {
  attribute: PropTypes.object.isRequired,
};
