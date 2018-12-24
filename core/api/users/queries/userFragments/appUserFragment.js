import { simpleUserFragment } from './userFragments';
import fullUserFragment from './fullUserFragment';

export default {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
  loans: {
    _id: 1,
    name: 1,
    borrowers: { _id: 1 },
    purchaseType: 1,
    logic: { step: 1 },
  },
  borrowers: { _id: 1, name: 1 },
  properties: { _id: 1 },
};
