import { userMutations } from '../users';
import { loanMutations } from '../loans';
import { borrowerMutations } from '../borrowers';
import { offerMutations } from '../offers';
import { propertyMutations } from '../properties';

export { default as createMutator } from './createMutator';
export { default as callMutation } from './callMutation';

// Export all mutation definitions here
export const mutations = {
  ...loanMutations,
  ...borrowerMutations,
  ...offerMutations,
  ...propertyMutations,
  ...userMutations,
};
