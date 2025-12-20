import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { languagesApi } from '../api/languages';

const initialState = [];

export const LanguagesContext = createContext();

export const LanguagesProvider = ({ children }) => {
  const [languages, setLanguages] = useState(initialState);

  const fetchLanguages = useCallback(async () => {
    try {
      const languages = await languagesApi.getLanguages();
      setLanguages(languages);
    } catch (err) {
      console.error(err);
      setLanguages([]);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => languages, [languages]);

  return (
    <LanguagesContext.Provider value={value}>
      {children}
    </LanguagesContext.Provider>
  );
};

LanguagesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const LanguagesConsumer = LanguagesContext.Consumer;
