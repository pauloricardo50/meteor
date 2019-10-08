import omit from 'lodash/omit';

import { FILE_STATUS } from '../fileConstants';
import uploadDirective from './uploadDirective';

const uploadDirectiveTemp = {
  ...uploadDirective,
  getDefaultStatus: () => FILE_STATUS.VALID,
  directive: omit(uploadDirective, ['x-amz-meta-status']),
};

export default uploadDirectiveTemp;
