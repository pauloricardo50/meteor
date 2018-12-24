import loanBaseFragment from './loanBaseFragment';

export default {
  ...loanBaseFragment,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};
