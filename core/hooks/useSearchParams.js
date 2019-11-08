import { useLocation } from 'react-router-dom';

const useSearchParams = () => {
  const location = useLocation();

  const { search } = location;
  const searchParams = {};

  if (search) {
    const params = new URLSearchParams(search);
    [...params.entries()].forEach(([key, value]) => {
      searchParams[key] = value;
    });
  }

  return searchParams;
};

export default useSearchParams;
