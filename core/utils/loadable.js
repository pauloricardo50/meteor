import Loadable from 'react-loadable';
import Loading from 'core/components/Loading';

export default function MyLoadable(options) {
  return Loadable({
    loading: Loading,
    delay: 200, // Hides the loading component for 200ms, to avoid flickering
    ...options,
  });
}
