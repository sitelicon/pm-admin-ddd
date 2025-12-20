import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { hasFlag } from 'country-flag-icons';
import flagIcons from 'country-flag-icons/react/3x2';
import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { tokens } from '../../../locales/tokens';
import { useLanguages } from '../../../hooks/use-languages';

export const LanguagePopover = (props) => {
  const { anchorEl, onClose, open = false, ...other } = props;
  const { i18n, t } = useTranslation();
  const languages = useLanguages();

  const handleChange = useCallback(
    async (language) => {
      onClose?.();
      await i18n.changeLanguage(language);
      toast.success('Idioma actualizado');
    },
    [onClose, i18n],
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      onClose={onClose}
      open={open}
      sx={{ sx: { width: 240 } }}
      {...other}
    >
      {languages.map((language) => {
        const flagIso =
          language.iso === 'en'
            ? 'gb'
            : language.iso === 'mad'
            ? 'pt'
            : language.iso;
        const useFlag = hasFlag(flagIso.toUpperCase());
        const Flag = useFlag ? flagIcons[flagIso.toUpperCase()] : null;

        return (
          <MenuItem
            key={language.id}
            onClick={() => handleChange(language.iso)}
            selected={i18n.language === language.iso}
          >
            {useFlag && (
              <ListItemIcon>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 28,
                    '& svg': {
                      width: '100%',
                    },
                  }}
                >
                  <Flag />
                </Stack>
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Typography variant="subtitle2">{language.language}</Typography>
              }
            />
          </MenuItem>
        );
      })}
    </Popover>
  );
};

LanguagePopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
