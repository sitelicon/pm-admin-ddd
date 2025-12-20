import { useCallback, useEffect, useState } from 'react';
import { countriesAPI } from '../api/countries';

export const useCountries = () => {
  const [state, setState] = useState({
    countries: [],
    loading: true,
  });

  const getCountries = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));

      const result = await countriesAPI.getCountries();
      setState((prev) => ({
        ...prev,
        countries: result,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  return state;
};
