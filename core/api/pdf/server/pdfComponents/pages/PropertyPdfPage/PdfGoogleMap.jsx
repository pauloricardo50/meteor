//
import { Meteor } from 'meteor/meteor';

import React from 'react';
import queryString from 'query-string';

import Calculator from '../../../../../../utils/Calculator';

const makeGoogleMapsUrl = property => {
  const { address1, city } = property;

  const place = `${address1}, ${city}`;

  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
  const query = queryString.stringify(
    {
      center: place,
      zoom: 13,
      size: '640x300', // This ratio is good for 300px height image and full width
      markers: `color:red|${place}`,
      key: Meteor.settings.public.google_maps_key,
      scale: 2,
      language: 'fr',
    },
    { sort: false },
  );
  const url = `${baseUrl}${query}`;
  return url;
};

const PdfGoogleMap = ({ loan }) => {
  const property = Calculator.selectProperty({ loan });
  return (
    <div
      className="pdf-google-map"
      style={{ backgroundImage: `url("${makeGoogleMapsUrl(property)}")` }}
    />
  );
};

export default PdfGoogleMap;
