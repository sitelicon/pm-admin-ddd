import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguages } from './use-languages';

export const useLanguageId = () => {
  const { i18n } = useTranslation();
  const languages = useLanguages();
  const languageId = useMemo(
    () => languages.find((language) => language.iso === i18n.language)?.id,
    [i18n.language, languages],
  );

  return languageId;
};
