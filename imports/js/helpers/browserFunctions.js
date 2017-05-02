export const getWidth = () => {
  const w = window;
  const d = document;
  const documentElement = d.documentElement;
  const body = d.getElementsByTagName('body')[0];
  return w.innerWidth || documentElement.clientWidth || body.clientWidth;
};

const getSubdomain = () => {
  const fullPath = window.location.host;
  // window.location.host is subdomain.domain.com
  return fullPath.split('.')[0];
};

export const isDemo = () => {
  return getSubdomain() === 'demo';
};

export const storageAvailable = type => {
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
