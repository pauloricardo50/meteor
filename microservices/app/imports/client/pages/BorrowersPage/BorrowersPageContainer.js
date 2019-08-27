import { compose, branch, renderComponent } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';
import { APPLICATION_TYPES } from 'core/api/constants';

export default compose(withMatchParam('tabId'));
