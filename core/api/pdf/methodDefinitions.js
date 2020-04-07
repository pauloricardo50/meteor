import { Match } from 'meteor/check';

import { Method } from '../methods/methods';
import { PDF_TYPES } from './pdfConstants';

export const generatePDF = new Method({
  name: 'generatePDF',
  params: {
    type: Match.OneOf(...Object.values(PDF_TYPES)),
    params: Object,
    options: Object,
    htmlOnly: Match.Maybe(Boolean),
  },
});
