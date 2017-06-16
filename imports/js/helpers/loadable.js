import Loadable from 'react-loadable';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

export default function MyLoadable(options) {
  return Loadable({
    loading: LoadingComponent,
    delay: false,
    ...options,
  });
}
