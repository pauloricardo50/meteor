import Loadable from 'react-loadable';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

export default function MyLoadable(opts) {
  return Loadable({
    LoadingComponent,
    // delay: 200,
    ...opts,
  });
}
