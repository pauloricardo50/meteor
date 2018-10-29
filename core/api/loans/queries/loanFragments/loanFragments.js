// Separate these fragments into separate files to avoid cyclic dependencies

export const loanBaseFragment = {
  borrowerIds: 1,
  borrowers: { firstName: 1, lastName: 1, name: 1 },
  createdAt: 1,
  logic: 1,
  general: 1,
  verificationStatus: 1,
  name: 1,
  propertyIds: 1,
  properties: { value: 1, address1: 1 },
  selectedStructure: 1,
  status: 1,
  structure: 1,
  structures: 1,
  updatedAt: 1,
  userId: 1,
  promotions: {
    name: 1,
    address: 1,
  },
  promotionOptions: {
    promotionLots: {
      name: 1,
      status: 1,
      reducedStatus: 1,
      value: 1,
    },
    name: 1,
    custom: 1,
    attributedToMe: 1,
    priority: 1,
    promotion: 1,
    value: 1,
  },
  hasPromotion: 1,
  // $options: { sort: { createdAt: 1 } },
};
