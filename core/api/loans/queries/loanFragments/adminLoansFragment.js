import loanBaseFragment from './loanBaseFragment';

export default {
  ...loanBaseFragment,
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { value: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};
