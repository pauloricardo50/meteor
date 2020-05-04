import { compose } from 'recompose';

import withContextConsumer from '../../api/containerToolkit/withContextConsumer';
import { ProPropertyPageContext } from './ProPropertyPageContext';

export default compose(
  withContextConsumer({ Context: ProPropertyPageContext }),
);
