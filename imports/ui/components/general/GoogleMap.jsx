import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { GoogleMaps } from 'meteor/dburles:google-maps';

export default class GoogleMap extends Component {
  componentDidMount() {
    GoogleMaps.create({
      name: this.name,
      element: this.map,
      options: {
        center: this.props.latlng,
        zoom: 14,
        scrollwheel: false,
        disableDefaultUI: true,
      },
    });

    this.addMarker();
  }

  addMarker = () => {
    GoogleMaps.ready(this.name, (map) => {
      const infowindow = new window.google.maps.InfoWindow({
        content: this.props.address,
      });

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

  componentWillUnmount() {
    if (GoogleMaps.maps[this.name]) {
      window.google.maps.event.clearInstanceListeners(
        GoogleMaps.maps[this.name].instance,
      );
      delete GoogleMaps.maps[this.name];
    }
  }

  render() {
    return (
      <div
        ref={(c) => {
          this.map = c;
        }}
        style={this.props.style}
        className={this.props.className}
      />
    );
  }
}

GoogleMap.propTypes = {
  id: PropTypes.string,
  latlng: PropTypes.object.isRequired,
  address: PropTypes.string,
};

GoogleMap.defaultProps = {
  id: 'myMap',
  address: undefined,
};
