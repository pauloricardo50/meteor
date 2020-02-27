// import Fibers from 'fibers';

export const storeOnFiber = (key, value) => {
  const Fibers = require('fibers');
  Fibers.current[key] = value;
};

export const getFromFiber = key => {
  const Fibers = require('fibers');
  return Fibers.current && Fibers.current[key];
};

export const removeFromFiber = key => {
  const Fibers = require('fibers');
  delete Fibers.current[key];
};
