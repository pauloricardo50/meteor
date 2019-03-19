import Loadable from 'core/utils/loadable';

export default Loadable({ loader: () => import('./index') });
