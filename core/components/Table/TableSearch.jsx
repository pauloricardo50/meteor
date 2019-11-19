// @flow
import React from 'react';

import useDebouncedInput from '../../hooks/useDebouncedInput';
import TextInput from '../TextInput';
import Icon from '../Icon';

type TableSearchProps = {};

const TableSearch = ({ search, onChange, ...props }: TableSearchProps) => {
  const [debouncedValue, debouncedOnChange] = useDebouncedInput({
    value: search,
    onChange,
  });

  return (
    <TextInput
      value={debouncedValue}
      onChange={debouncedOnChange}
      label="Recherche"
      startAdornment={<Icon type="search" />}
      {...props}
    />
  );
};
export default TableSearch;
