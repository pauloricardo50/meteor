import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const getLatLngFromAddress = address =>
  geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .catch(console.log);

export const getAddressString = ({ address1, zipCode, city }) =>
  `${address1}, ${zipCode} ${city}`;

export const isAddressIncomplete = ({ address1, zipCode, city }) =>
  !address1 ||
  !city ||
  !zipCode ||
  (address1 === '' || city === '' || zipCode === '');
