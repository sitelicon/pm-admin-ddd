import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { hasFlag } from 'country-flag-icons';
import flagIcons from 'country-flag-icons/react/3x2';
import { LanguagePopover } from './language-popover';

export const LanguageSwitch = () => {
  const anchorRef = useRef(null);
  const { i18n } = useTranslation();
  const [openPopover, setOpenPopover] = useState(false);

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const flagIso =
    i18n.language === 'en'
      ? 'gb'
      : i18n.language === 'mad'
      ? 'pt'
      : i18n.language;
  const useFlag = hasFlag(flagIso.toUpperCase());
  const Flag = useFlag ? flagIcons[flagIso.toUpperCase()] : null;

  return (
    <>
      <Tooltip title="Cambiar idioma">
        <IconButton onClick={handlePopoverOpen} ref={anchorRef}>
          <Box sx={{ width: 28 }}>{useFlag ? <Flag /> : i18n.language}</Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover
        anchorEl={anchorRef.current}
        onClose={handlePopoverClose}
        open={openPopover}
      />
    </>
  );
};
