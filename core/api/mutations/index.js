import { loanMutations } from '../loans';
import { borrowerMutations } from '../borrowers';
import { offerMutations } from '../offers';

export { default as createMutator } from './createMutator';
export { default as callMutation } from './callMutation';

export const mutations = {
  ...loanMutations,
  ...borrowerMutations,
  ...offerMutations,
};
