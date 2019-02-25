// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import queryString from 'query-string';

import Calculator from '../../../../../utils/Calculator';

type PdfGoogleMapProps = {};

const makeGoogleMapsUrl = (property) => {
  const { address1, city, zipCode } = property;

  const place = `${address1}, ${city}`;

  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
  const query = queryString.stringify(
    {
      center: place,
      zoom: 14,
      size: '1200x900',
      markers: `color:red|${place}`,
      key: Meteor.settings.public.google_maps_key,
    },
    { sort: false },
  );
  const url = `${baseUrl}${query}`;
  return url;
};

const PdfGoogleMap = ({ loan }: PdfGoogleMapProps) => {
  const property = Calculator.selectProperty({ loan });
  return (
    <div
      className="pdf-google-map"
      style={{ backgroundImage: `url("${makeGoogleMapsUrl(property)}")` }}
    />
  );
};

export default PdfGoogleMap;
