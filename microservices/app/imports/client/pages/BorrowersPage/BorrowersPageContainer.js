import { compose } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';

export default compose(withMatchParam('tabId'));
