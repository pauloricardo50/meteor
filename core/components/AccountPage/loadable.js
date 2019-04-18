import Loadable from '../../utils/loadable';

export default Loadable({ loader: () => import('./index') });
