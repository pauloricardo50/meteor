import React from 'react';
import PropTypes from 'prop-types';

export default class OfferList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ul>{this.props.offers.map(o => <li key={o._id}>{o.organization}</li>)}</ul>;
  }
}

OfferList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
