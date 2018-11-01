const addressReducer = {
  address: {
    body: {
      address1: 1,
      zipCode: 1,
      city: 1,
    },
    reduce(object) {
      const { address1, zipCode, city } = object;
      return `${address1}, ${zipCode} ${city}`;
    },
  },
};

export default addressReducer;
