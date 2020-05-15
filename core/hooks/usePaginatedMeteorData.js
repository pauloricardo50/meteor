import { useCallback, useState } from 'react';

import { useStaticMeteorData } from './useMeteorData';

const getSortObject = (sortBy, sortDirection) => {
  if (!sortBy) {
    return {};
  }

  return { [sortBy]: sortDirection };
};

const getPaginationParams = ({
  query,
  pageSize,
  pageIndex,
  sort,
  sortDirection,
}) => {
  if (typeof query === 'string') {
    return {
      $options: {
        limit: pageSize,
        skip: pageIndex * pageSize,
        sort: getSortObject(sort, sortDirection),
      },
    };
  }

  return {
    $limit: pageSize,
    $skip: pageIndex * pageSize,
    $sort: getSortObject(sort, sortDirection),
  };
};

const usePaginatedMeteorData = (
  { pageSize = 10, sort, sortDirection, pageIndex, ...queryConfig },
  deps = [],
) => {
  const [localPageIndex, setPageIndex] = useState(0);
  const finalPageIndex =
    typeof pageIndex === 'number' ? pageIndex : localPageIndex;
  const {
    data,
    loading: loadingData,
    refetch: refetchData,
  } = useStaticMeteorData(
    {
      ...queryConfig,
      params: {
        ...queryConfig.params,
        ...getPaginationParams({
          query: queryConfig.query,
          pageSize,
          pageIndex: finalPageIndex,
          sort,
          sortDirection,
        }),
      },
      type: 'many',
    },
    [pageSize, finalPageIndex, sort, sortDirection, ...deps],
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
  const hasMoreResults =
    !loading && totalCount > pageIndex * pageSize + pageSize;
  const pageCount = Math.ceil(totalCount / pageSize) - 1;

  const nextPage = useCallback(() => {
    setPageIndex(currentPage => Math.min(currentPage + 1, pageCount));
  }, [pageCount]);

  const previousPage = useCallback(() => {
    setPageIndex(currentPage => Math.max(currentPage - 1, 1));
  }, []);

  const setPage = useCallback(
    newPage => {
      const pageNumber = Math.max(1, newPage);
      setPageIndex(Math.min(pageNumber, pageCount));
    },
    [pageCount],
  );

  return {
    data,
    hasMoreResults,
    loading,
    nextPage,
    pageIndex: finalPageIndex,
    previousPage,
    refetch,
    setPage,
    totalCount,
    pageCount,
  };
};

export default usePaginatedMeteorData;
