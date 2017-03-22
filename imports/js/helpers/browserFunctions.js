export const getWidth = () => {
  const w = window;
  const d = document;
  const documentElement = d.documentElement;
  const body = d.getElementsByTagName('body')[0];
  return w.innerWidth || documentElement.clientWidth || body.clientWidth;
};
