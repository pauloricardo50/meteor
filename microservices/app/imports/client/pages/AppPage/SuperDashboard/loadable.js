import loadable from 'core/utils/loadable';

export default loadable({
  loader: () => import('./index'),
});
