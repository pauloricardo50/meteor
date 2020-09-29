import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withProps, withState } from 'recompose';

import { withLoading } from '../Loading';
import T from '../Translation';
import GoogleMap from './GoogleMap';
import GoogleMapContainer from './GoogleMapContainer';
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
    UNSAFE_componentWillReceiveProps({ address }) {
      if (address !== this.props.address) {
        this.props.getLatlngFromGoogle();
      }
    },
  }),
  withLoading(),
)(MapWithMarker);
