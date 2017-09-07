import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { GoogleMaps } from 'meteor/dburles:google-maps';

import { LoadingComponent } from './Loading';

class GoogleMap extends Component {
  componentDidMount() {
    GoogleMaps.load({
      v: '3',
      key: Meteor.settings.public.google_maps_key,
      libraries: 'places',
    });
    this.forceUpdate();
  }

  render() {
    if (this.props.loaded && !!window.google && !!window.google.maps) {
      return (
        <div
          className="map-container"
          ref={c => (this.container = c)}
          // style={{ width: '100%' }}
        >
          {this.props.children}
        </div>
      );
    }

    return <LoadingComponent />;
  }
}

GoogleMap.propTypes = {
  loaded: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const GoogleMapContainer = createContainer(
  () => ({ loaded: GoogleMaps.loaded() }),
  GoogleMap,
);

export default GoogleMapContainer;
