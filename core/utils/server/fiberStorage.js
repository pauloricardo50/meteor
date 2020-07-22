let _fibers;

const getFibers = () => {
  if (!_fibers) {
    _fibers = require('fibers');
  }

  return _fibers;
};

export const storeOnFiber = (key, value) => {
  const Fibers = getFibers();
  Fibers.current[key] = value;
};

export const getFromFiber = key => {
  const Fibers = getFibers();
  return Fibers.current && Fibers.current[key];
};

export const removeFromFiber = key => {
  const Fibers = getFibers();
  delete Fibers.current[key];
};
