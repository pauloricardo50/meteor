import { useCallback, useState } from 'react';

import { useStaticMeteorData } from './useMeteorData';

const getPaginationParams = ({ query, pageSize, page }) => {
  if (typeof query === 'string') {
    return {
      $options: { limit: pageSize, skip: page * pageSize },
    };
  }

  return { $limit: pageSize, $skip: page * pageSize };
};

const usePaginatedMeteorData = (
  { pageSize = 10, ...queryConfig },
  deps = [],
) => {
  const [page, setPageState] = useState(0);
  const {
    data,
    loading: loadingData,
    refetch: refetchData,
  } = useStaticMeteorData(
    {
      ...queryConfig,
      params: {
        ...queryConfig.params,
        ...getPaginationParams({ query: queryConfig.query, pageSize, page }),
      },
      type: 'many',
    },
    [pageSize, page, ...deps],
  );
  const {
    data: totalCount,
    loading: loadingCount,
    refetch: refetchCount,
  } = useStaticMeteorData({ ...queryConfig, type: 'count' }, deps);

  const refetch = useCallback(() => {
    refetchData();
    refetchCount();
  }, [refetchData, refetchCount]);

  const loading = loadingData || loadingCount;
  const hasMoreResults = !loading && totalCount > page * pageSize + pageSize;
  const maxPage = Math.ceil(totalCount / pageSize) - 1;

  const nextPage = useCallback(() => {
    setPageState(currentPage => Math.min(currentPage + 1, maxPage));
  }, [maxPage]);

  const previousPage = useCallback(() => {
    setPageState(currentPage => Math.max(currentPage - 1, 1));
  }, []);

  const setPage = useCallback(
    newPage => {
      const pageNumber = Math.max(1, newPage);
      setPageState(Math.min(pageNumber, maxPage));
    },
    [maxPage],
  );

  return {
    data,
    hasMoreResults,
    loading,
    nextPage,
    page,
    previousPage,
    refetch,
    setPage,
    totalCount,
  };
};

export default usePaginatedMeteorData;
