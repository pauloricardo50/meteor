import React, { useEffect, useRef } from 'react';
import { usePagination, useRowSelect, useSortBy } from 'react-table';
import useDebounce from 'react-use/lib/useDebounce';

import Checkbox from '../../Material/Checkbox';

export const getTableHooks = ({ addRowProps, selectable, sortable }) => {
  const array = [];

  if (sortable) {
    array.push(useSortBy);
  }

  // This hook must be added after the sortBy hook
  array.push(usePagination);

  if (selectable) {
    array.push(useRowSelect);
    array.push(hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
          padding: 'checkbox',
        },
        ...columns,
      ]);
    });
  }

  if (addRowProps) {
    array.push(hooks => {
      hooks.getRowProps.push((rowProps, { row }) => ({
        ...rowProps,
        ...addRowProps(row),
      }));
    });
  }

  return array;
};

// Only call the callback on subsequent renders
export const useStateChangeCallback = (callback, args) => {
  const isMountedRef = useRef(false);

  const [_, cancel] = useDebounce(
    () => {
      if (isMountedRef.current && callback) {
        callback(args);
      }
    },
    100,
    [callback, ...Object.values(args)],
  );

  useEffect(() => {
    // On first render, avoid calling the callback, and cancel the debounce
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      cancel();
    }
  }, []);
};
