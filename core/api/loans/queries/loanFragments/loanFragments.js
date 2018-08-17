// Separate these fragments into separate files to avoid cyclic dependencies

export const loanBaseFragment = {
  borrowers: { firstName: 1, lastName: 1 },
  createdAt: 1,
  logic: 1,
  general: 1,
  name: 1,
  properties: { value: 1, address1: 1 },
  selectedStructure: 1,
  status: 1,
  structures: 1,
  updatedAt: 1,
  userId: 1,
};
