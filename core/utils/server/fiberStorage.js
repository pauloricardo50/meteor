import Fibers from 'fibers';

export const storeOnFiber = (key, value) => {
  Fibers.current[key] = value;
};

export const getFromFiber = key => Fibers.current && Fibers.current[key];

export const removeFromFiber = key => {
  delete Fibers.current[key];
};
