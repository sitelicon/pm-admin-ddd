import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { storesApi } from '../api/stores';

const initialState = [];

export const StoresContext = createContext();

export const StoresProvider = ({ children }) => {
  const [stores, setStores] = useState(initialState);

  const fetchStores = useCallback(async () => {
    try {
      const stores = await storesApi.getStores();
      setStores(stores);
    } catch (err) {
      console.error(err);
      setStores([]);
    }
  }, []);

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => stores, [stores]);

  return (
    <StoresContext.Provider value={value}>{children}</StoresContext.Provider>
  );
};

StoresProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const StoresConsumer = StoresContext.Consumer;
