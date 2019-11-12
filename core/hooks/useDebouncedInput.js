import { useState } from 'react';
import { useDebounce } from 'react-use';

const useDebouncedInput = ({
  value,
  onChange,
  debounce = true,
  timeout = 300,
}) => {
  const [fastValue, setFastValue] = useState(value);
  useDebounce(() => debounce && onChange(fastValue), timeout, [fastValue]);

  return debounce ? [fastValue, setFastValue] : [value, onChange];
};

export default useDebouncedInput;
