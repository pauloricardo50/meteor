const getAddressComponentsString = ({ address1, zipCode, city, canton }) =>
  `${address1 ? '1' : '0'}${zipCode ? '1' : '0'}${city ? '1' : '0'}${
    canton ? '1' : '0'
  }`;

const addressReducer = {
  address: {
    body: {
      address1: 1,
      zipCode: 1,
      city: 1,
      canton: 1,
    },
    reduce(object) {
      const { address1, zipCode, city, canton } = object;
      const componentsString = getAddressComponentsString(object);

      switch (componentsString) {
        case '0000':
          return 'Aucune addresse indiquée';
        case '0001':
          return canton;
        case '0010':
          return city;
        case '0011':
          return `${city} (${canton})`;
        case '0100':
          return zipCode;
        case '0101':
          return `${zipCode} (${canton})`;
        case '0110':
          return `${zipCode} ${city}`;
        case '0111':
          return `${zipCode} ${city} (${canton})`;
        case '1000':
          return address1;
        case '1001':
          return `${address1} (${canton})`;
        case '1010':
          return `${address1}, ${city}`;
        case '1011':
          return `${address1}, ${city} (${canton})`;
        case '1100':
          return `${address1}, ${zipCode}`;
        case '1101':
          return `${address1}, ${zipCode} (${canton})`;
        case '1110':
          return `${address1}, ${zipCode} ${city}`;
        case '1111':
          return `${address1}, ${zipCode} ${city} (${canton})`;
        default:
          return 'Aucune addresse indiquée';
      }
    },
  },
};

export default addressReducer;
