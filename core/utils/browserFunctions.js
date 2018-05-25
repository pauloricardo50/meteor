export const getWidth = () => {
  if (global.window) {
    const w = window;
    const d = document;
    const documentElement = d.documentElement;
    const body = d.getElementsByTagName('body')[0];
    return w.innerWidth || documentElement.clientWidth || body.clientWidth;
  }
};

export const storageAvailable = (type) => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

export const easeOut = (min, max, intervals) => {
  const diff = 1 / intervals;
  const difference = max - min;
  const curve = [];

  for (let i = diff; i <= 1; i += diff) {
    curve.push(min + difference * Math.pow(i, 0.48));
  }
  return curve;
};
