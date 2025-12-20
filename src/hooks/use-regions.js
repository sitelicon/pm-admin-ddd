import { useCallback, useEffect, useState } from 'react';
import { regionsApi } from '../api/regions';

export const useRegions = (countryIso) => {
  const [state, setState] = useState({
    regions: [],
    loading: false,
  });

  const getRegions = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      const response = await regionsApi.getRegionsByCountryIso(countryIso);
      setState((prev) => ({
        ...prev,
        regions: response,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [countryIso]);

  useEffect(() => {
    getRegions();
  }, [getRegions]);

  return state;
};
