// @flow
import { useMemo } from 'react';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { analysisBodies, mapData } from './analysisHelpers';

export const useAnalysisData = ({ collection, formatMessage }) => {
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

  return { data: formattedData, loading };
};
