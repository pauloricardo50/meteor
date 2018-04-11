import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { GoogleMaps } from 'meteor/dburles:google-maps';

import Loading from 'core/components/Loading';

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
    const { loaded: googleApiHasLoaded, children } = this.props;
    const isLoaded =
      googleApiHasLoaded && !!window.google && !!window.google.maps;

    if (!isLoaded) {
      return <Loading />;
    }

    return (
      <div
        className="map-container"
        ref={(c) => {
          this.container = c;
        }}
      >
        {children}
      </div>
    );
  }
}

GoogleMap.propTypes = {
  loaded: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default GoogleMap;
