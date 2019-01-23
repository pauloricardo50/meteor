const addressReducer = {
  address: {
    body: {
      address1: 1,
      zipCode: 1,
      city: 1,
    },
    reduce(object) {
      const { address1, zipCode, city } = object;
      return address1
        ? `${address1}, ${zipCode} ${city}`
        : 'Aucune addresse indiquée';
    },
  },
};

export default addressReducer;
