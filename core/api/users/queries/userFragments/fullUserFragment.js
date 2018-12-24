import loanBaseFragment from '../../../loans/queries/loanFragments/loanBaseFragment';
import { simpleUserFragment } from './userFragments';

export default {
  ...simpleUserFragment,
  assignedEmployee: simpleUserFragment,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
  loans: loanBaseFragment,
  apiToken: 1,
};
