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

/**
 * getPlace - Description
 *
 * @param {Object} origin {lat: Number, lng: Number}
 * @param {String} type   type of place to search for
 *
 * @return {type} returns a promise with object {name: String, distance: Object}
 */
export const getNearbyPlace = (latitude, longitude, type, byDistance) => {
  const location = new window.google.maps.LatLng(latitude, longitude);

  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(div);
    service.nearbySearch(
      {
        location,
        radius: byDistance ? undefined : 5000,
        rankBy: byDistance
          ? window.google.maps.places.RankBy.DISTANCE
          : window.google.maps.places.RankBy.PROMINENCE,
        type: [type],
      },
      (places, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(places[0]);
        } else {
          reject(status);
        }
      },
    );
  }).then((place) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const name = place.name;

    return new Promise((resolve, reject) => {
      const distanceService = new window.google.maps.DistanceMatrixService();

      distanceService.getDistanceMatrix(
        {
          origins: [location],
          destinations: [new window.google.maps.LatLng(lat, lng)],
          travelMode: 'WALKING',
        },
        (result, status) => {
          if (status !== 'OK') {
            reject(status);
          }
          resolve({ distance: result.rows[0].elements[0].distance, name });
        },
      );
    });
  });
};
