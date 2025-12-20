import { useContext } from 'react';
import { LanguagesContext } from '../contexts/languages-context';

export const useLanguages = () => {
  const context = useContext(LanguagesContext);

  if (!context) {
    throw new Error('useLanguages must be used within a LanguagesProvider');
  }

  return context;
};
