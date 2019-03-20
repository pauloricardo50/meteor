import { compose } from 'recompose';

import { ProPropertyPageContext } from './ProPropertyPageContext';
import withContextConsumer from '../../api/containerToolkit/withContextConsumer';

export default compose(withContextConsumer({ Context: ProPropertyPageContext }));
