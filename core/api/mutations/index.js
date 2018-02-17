import { loanMutations } from '../loans';
import { borrowerMutations } from '../borrowers';

export { default as createMutator } from './createMutator';
export { default as callMutation } from './callMutation';

export const mutations = {
  ...loanMutations,
  ...borrowerMutations,
};
