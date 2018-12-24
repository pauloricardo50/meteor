export default {
  name: 1,
  user: { name: 1, phoneNumbers: 1, email: 1 },
  promotionProgress: 1,
  promotionLinks: 1,
  promotionOptions: {
    name: 1,
    status: 1,
    promotionLots: { _id: 1, attributedTo: { user: { _id: 1 } } },
    solvency: 1,
  },
  promotions: { _id: 1, users: { _id: 1 }, status: 1 },
  createdAt: 1,
};
