import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/dburles:google-maps';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import defaultOptions from './defaultOptions';

export default class GoogleMap extends Component {
  componentDidMount() {
    const options = merge(
      defaultOptions,
      { center: this.props.latlng },
      this.props.options,
    );

    GoogleMaps.create({ name: this.name, element: this.map, options });

    this.addMarker();
  }

  componentWillUnmount() {
    if (GoogleMaps.maps[this.name]) {
      window.google.maps.event.clearInstanceListeners(GoogleMaps.maps[this.name].instance);
      delete GoogleMaps.maps[this.name];
    }
  }

  addMarker = () => {
    GoogleMaps.ready(this.name, (map) => {
      const infowindow = new window.google.maps.InfoWindow({
        content: this.props.address,
      });

      map.instance.setCenter(this.props.latlng);

      const marker = new window.google.maps.Marker({
        draggable: false,
        animation: window.google.maps.Animation.DROP,
        position: this.props.latlng,
        map: map.instance,
        id: 'propertyMarker',
      });

      marker.addListener('click', () => {
        infowindow.open(map.instance, marker);
      });

      Meteor.setTimeout(() => infowindow.open(map.instance, marker), 1000);
    });
  };

  render() {
    return (
      <div
        ref={(c) => {
          this.map = c;
        }}
        className="google-map"
      />
    );
  }
}

GoogleMap.propTypes = {
  id: PropTypes.string,
  latlng: PropTypes.object.isRequired,
  address: PropTypes.string,
  options: PropTypes.object,
};

GoogleMap.defaultProps = {
  id: 'myMap',
  address: undefined,
  options: {},
};
