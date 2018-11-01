import { Method } from '../methods/methods';

export const generatePDF = new Method({
  name: 'generatePDF',
  params: {
    params: Object,
    type: String,
  },
});
