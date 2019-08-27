import loadable from 'core/utils/loadable';

export default loadable({
  req: () => require('./index'),
  loader: () => import('./index'),
});

