import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/epotek:google-maps';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import defaultOptions from './defaultOptions';

export default class GoogleMap extends Component {
  componentDidMount() {
    const { id, latlng, options } = this.props;
    const combinedOptions = merge(
      {},
      defaultOptions,
      { center: latlng },
      options,
    );

    GoogleMaps.create({
      name: id,
      element: this.map,
      options: combinedOptions,
    });

    this.addMarker();
  }

  componentWillUnmount() {
    const { id } = this.props;
    if (GoogleMaps.maps[id]) {
      window.google.maps.event.clearInstanceListeners(
        GoogleMaps.maps[id].instance,
      );
      delete GoogleMaps.maps[id];
    }
  }

  addMarker = () => {
    const { id, latlng, address, withMarker } = this.props;

    GoogleMaps.ready(id, map => {
      const infowindow = new window.google.maps.InfoWindow({
        content: address,
      });

      map.instance.setCenter(latlng);

      if (withMarker) {
        const marker = new window.google.maps.Marker({
          draggable: false,
          animation: window.google.maps.Animation.DROP,
          position: latlng,
          map: map.instance,
          id: 'propertyMarker',
        });

        marker.addListener('click', () => {
          infowindow.open(map.instance, marker);
        });

        Meteor.setTimeout(() => infowindow.open(map.instance, marker), 1000);
      }
    });
  };

  render() {
    return (
      <div
        className="google-map"
        id={this.props.id}
        ref={component => {
          this.map = component;
        }}
      />
    );
  }
}

GoogleMap.propTypes = {
  address: PropTypes.string,
  id: PropTypes.string,
  latlng: PropTypes.object.isRequired,
  options: PropTypes.object,
  withMarker: PropTypes.bool,
};

GoogleMap.defaultProps = {
  id: 'myMap',
  address: undefined,
  options: {},
  withMarker: true,
};
