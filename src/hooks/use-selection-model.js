import { useCallback, useEffect, useMemo, useState } from 'react';

export const useSelectionModel = (items) => {
  const itemsIds = useMemo(() => {
    return items?.map((item) => item.id) || [];
  }, [items]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [itemsIds]);

  const selectOne = useCallback((itemId) => {
    setSelected((prevState) => [...prevState, itemId]);
  }, []);

  const deselectOne = useCallback((itemId) => {
    setSelected((prevState) => {
      return prevState.filter((id) => id !== itemId);
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected([...itemsIds]);
  }, [itemsIds]);

  const deselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected,
  };
};
