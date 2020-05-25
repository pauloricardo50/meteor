import { useCallback, useState } from 'react';

import { useStaticMeteorData } from './useMeteorData';

const getSortObject = (sort, sortDirection) => {
  if (!sort) {
    return {};
  }

  return { [sort]: sortDirection };
};

const getPaginationParams = ({
  infinite,
  pageIndex,
  pageSize,
  query,
  sort,
  sortDirection,
}) => {
  if (typeof query === 'string') {
    return {
      $options: {
        limit: infinite ? (pageIndex + 1) * pageSize : pageSize,
        skip: infinite ? 0 : pageIndex * pageSize,
        sort: getSortObject(sort, sortDirection),
      },
    };
  }

  return {
    $limit: infinite ? (pageIndex + 1) * pageSize : pageSize,
    $skip: infinite ? 0 : pageIndex * pageSize,
    $sort: getSortObject(sort, sortDirection),
  };
};

const usePaginatedMeteorData = (
  { pageSize = 10, sort, sortDirection, pageIndex, infinite, ...queryConfig },
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
          infinite,
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
    !loading &&
    (infinite
      ? totalCount > data?.length
      : totalCount > finalPageIndex * pageSize + pageSize);
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
