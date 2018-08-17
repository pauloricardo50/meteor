import React, { Component } from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import GoogleMapContainer from './GoogleMapContainer';
import GoogleMap from './GoogleMap';
import { getLatLngFromAddress } from './googleMapsHelpers';

class MapWithMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { address } = this.props;
    getLatLngFromAddress(address).then(latlng => this.setState({ latlng }));
  }

  render() {
    const { address, options, id } = this.props;
    const { latlng } = this.state;

    return latlng ? (
      <GoogleMap address={address} latlng={latlng} id={id} options={options} />
    ) : (
      <p className="description">
        <T id="GoogleMap.addressNotFound" />
      </p>
    );
  }
}

MapWithMarker.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.string,
  options: PropTypes.object,
};

MapWithMarker.defaultProps = {
  options: undefined,
  id: undefined,
};

export default GoogleMapContainer(MapWithMarker);
