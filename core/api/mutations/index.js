import { mutationDefinitions as loanMutations } from '../loans';

export { default as createMutator } from './createMutator';
export { default as callMutation } from './callMutation';

export const mutations = {
  ...loanMutations,
};
