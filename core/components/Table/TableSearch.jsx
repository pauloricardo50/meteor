import React from 'react';

import useDebouncedInput from '../../hooks/useDebouncedInput';
import Icon from '../Icon';
import TextInput from '../TextInput';

const TableSearch = ({ search, onChange, ...props }) => {
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
