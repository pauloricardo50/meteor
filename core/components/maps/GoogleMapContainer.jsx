import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Tracker } from 'meteor/tracker';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { LoadingComponent } from '../Loading';

const GoogleMapContainer = (WrappedComponent) => {
  class GoogleInjector extends Component {
    constructor(props) {
      super(props);

      this.state = { isLoaded: false };
    }

    componentDidMount() {
      GoogleMaps.load({
        v: '3',
        key: Meteor.settings.public.google_maps_key,
        libraries: 'places',
      });

      this.tracker = Tracker.autorun(() => {
        this.setState({ isLoaded: GoogleMaps.loaded() });
      });
    }

    componentWillUnmount() {
      this.tracker.stop();
    }

    render() {
      const { isLoaded } = this.state;
      const { className } = this.props;

      if (isLoaded && !!window.google && !!window.google.maps) {
        return (
          <div
            className={classnames({ 'map-container': true, [className]: true })}
            ref={(c) => {
              this.container = c;
            }}
          >
            <WrappedComponent {...this.props} />
          </div>
        );
      }

      return <LoadingComponent />;
    }
  }

  GoogleInjector.propTypes = {
    className: PropTypes.string,
  };

  GoogleInjector.defaultProps = {
    className: '',
  };

  return GoogleInjector;
};

export default GoogleMapContainer;
