import React from 'react';
import PropTypes from 'prop-types';

import { compose, withState, lifecycle, withProps } from 'recompose';
import T from '../Translation';
import { withLoading } from '../Loading';
import GoogleMapContainer from './GoogleMapContainer';
import GoogleMap from './GoogleMap';
import { getLatLngFromAddress } from './googleMapsHelpers';

const MapWithMarker = props => {
  const { address, options, id, latlng } = props;

  return latlng ? (
    <GoogleMap address={address} latlng={latlng} id={id} options={options} />
  ) : (
    <p className="description">
      <T id="Maps.addressNotFound" />
    </p>
  );
};

MapWithMarker.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.string,
  options: PropTypes.object,
};

MapWithMarker.defaultProps = {
  options: undefined,
  id: undefined,
};

export default compose(
  GoogleMapContainer,
  withState('loading', 'setLoading', false),
  withState('latlng', 'setLatlng', undefined),
  withProps(({ address, setLoading, setLatlng }) => ({
    getLatlngFromGoogle: () => {
      setLoading(true);
      getLatLngFromAddress(address)
        .then(setLatlng)
        .finally(() => setLoading(false));
    },
  })),
  lifecycle({
    componentDidMount() {
      this.props.getLatlngFromGoogle();
    },
    componentWillReceiveProps({ address }) {
      if (address !== this.props.address) {
        this.props.getLatlngFromGoogle();
      }
    },
  }),
  withLoading(),
)(MapWithMarker);
