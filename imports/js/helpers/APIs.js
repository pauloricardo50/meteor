export const getClosestStations = (latitude, longitude) =>
  fetch(
    `http://transport.opendata.ch/v1/locations?x=${latitude}&y=${longitude}`,
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('error code: ', response.status);
      } else {
        return response.json();
      }
    })
    .then(data => data.stations);
