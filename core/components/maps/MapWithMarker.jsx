import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

    return (
      <div className="map-with-marker">
        {latlng ? (
          <GoogleMap
            address={address}
            latlng={latlng}
            id={id}
            options={options}
          />
        ) :
          <p className="description">Adresse pas trouvée!</p>
        }
      </div>
    );
  }
}

MapWithMarker.propTypes = {
  address: PropTypes.string.isRequired,
  options: PropTypes.object,
  id: PropTypes.string,
};

MapWithMarker.defaultProps = {
  options: undefined,
  id: undefined,
};

export default GoogleMapContainer(MapWithMarker);
