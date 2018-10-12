export const addressReducer = {
  address: {
    body: {
      address1: 1,
      address2: 1,
      zipCode: 1,
      city: 1,
    },
    reduce(object) {
      const { address1, address2, zipCode, city } = object;
      return `${address1} ${address2 || ''}, ${zipCode} ${city}`;
    },
  },
};
