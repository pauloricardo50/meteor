import loadable from '../../../../utils/loadable';

export default loadable({
  req: () => require('./index'),
  loader: () => import('./index'),
});
