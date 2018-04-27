import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Tracker } from 'meteor/tracker';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Loading from '../Loading';

const googleMapContainer = (WrappedComponent) => {
  class GoogleMapContainer extends Component {
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

      // Fuck this, it works for an obscure reason
      // https://github.com/meteor/react-packages/issues/99#issuecomment-168772806
      setTimeout(this.trackIsLoading, 0);
    }

    componentWillUnmount() {
      this.tracker.stop();
    }

    trackIsLoading = () => {
      this.tracker = Tracker.autorun(() => {
        const isLoaded = GoogleMaps.loaded();

        this.setState({ isLoaded });
      });
    };

    render() {
      const { isLoaded } = this.state;
      const { className } = this.props;
      const mapIsLoaded = isLoaded && !!window.google && !!window.google.maps;

      if (mapIsLoaded) {
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

      return <Loading />;
    }
  }

  GoogleMapContainer.propTypes = {
    className: PropTypes.string,
  };

  GoogleMapContainer.defaultProps = {
    className: '',
  };

  return GoogleMapContainer;
};

export default googleMapContainer;
