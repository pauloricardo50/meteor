import { useMemo, useState, useEffect } from 'react';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { analysisBodies, mapData } from './analysisHelpers';

export const useAnalysisData = ({ collection, formatMessage }) => {
  const [cache, setCache] = useState({});
  const cacheExists = !!cache[collection];
  const { data, loading } = useStaticMeteorData(
    {
      query: collection,
      params: analysisBodies[collection],
    },
    [collection],
  );

  const formattedData = useMemo(
    () =>
      !loading && data ? mapData({ data, collection, formatMessage }) : [],
    [loading, data, collection],
  );

  useEffect(() => {
    // Don't load the mongo data again if it has already been loaded once
    // allows the user to quickly switch between reports and collections
    if (!cacheExists && !loading && formattedData && formattedData.length) {
      setCache(oldState => ({ ...oldState, [collection]: formattedData }));
    }
  }, [loading]);

  const isLoading = loading && !cacheExists;

  return { data: cache[collection] || [], loading: isLoading };
};
