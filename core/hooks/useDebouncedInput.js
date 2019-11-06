import { useState } from 'react';
import { useDebounce } from 'react-use';

const useDebouncedInput = ({ value, onChange, debounce = true }) => {
  const [fastValue, setFastValue] = useState(value);
  useDebounce(() => debounce && onChange(fastValue), 300, [fastValue]);

  return debounce ? [fastValue, setFastValue] : [value, onChange];
};

export default useDebouncedInput;
