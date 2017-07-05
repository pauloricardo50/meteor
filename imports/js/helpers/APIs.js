export const getClosestStations = (latitude, longitude) =>
  fetch(
    `https://transport.opendata.ch/v1/locations?x=${latitude}&y=${longitude}&type=station`,
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('error code: ', response.status);
      } else {
        return response.json();
      }
    })
    .then(data => data.stations);
