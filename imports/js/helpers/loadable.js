import Loadable from 'react-loadable';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

export default function MyLoadable(options) {
  return Loadable({
    loading: LoadingComponent,
    delay: 200, // Hides the loading component for 200ms, to avoid flickering
    ...options,
  });
}
