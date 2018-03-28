import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const getLatLngFromAddress = address =>
  geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .catch(console.log);
