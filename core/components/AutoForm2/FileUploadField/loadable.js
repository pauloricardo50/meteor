import loadable from '../../../utils/loadable';

export default loadable({
  loader: () => import('./index'),
  loaderProps: { small: true },
});
