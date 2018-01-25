import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const contextTypes = {
  loanRequest: PropTypes.object,
  borrowers: PropTypes.array,
  offers: PropTypes.array,
  property: PropTypes.object,
};

const requestWrapper = (WrappedComponent) => {
  class RequestContainer extends Component {
    constructor(props) {
      super();
      this.state = { ...this.getData(props) };
    }

    getChildContext() {
      const {
        loanRequest,
        requestBorrowers,
        requestOffers,
        requestProperty,
      } = this.state;

      return {
        loanRequest,
        borrowers: requestBorrowers,
        offers: requestOffers,
        property: requestProperty,
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ ...this.getData(nextProps) });
    }

    getData = (props) => {
      const {
        loanRequests, borrowers, properties, offers, ...rest
      } = props;

      // match has to be passed to children
      const { requestId } = props.match.params;

      let loanRequest = {};
      let requestBorrowers = [];
      let requestOffers = [];
      let requestProperty = {};

      if (requestId) {
        loanRequest =
          loanRequests &&
          loanRequests.find(request => request._id === requestId);
        requestBorrowers =
          loanRequest &&
          loanRequest.borrowers.map(borrowerId =>
            borrowers.find(borrower => borrower._id === borrowerId));
        requestOffers =
          offers && offers.filter(offer => offer.requestId === requestId);
        requestProperty =
          properties &&
          properties.find((property) => {
            // Add this check while transitioning from nested to separate property
            if (typeof loanRequest.property === 'string') {
              return property._id === loanRequest.property;
            }

            return false;
          });
      }

      return {
        loanRequest,
        requestBorrowers,
        requestOffers,
        requestProperty,
        rest,
      };
    };

    render() {
      const {
        loanRequest,
        requestBorrowers,
        requestOffers,
        requestProperty,
        rest,
      } = this.state;

      return (
        <WrappedComponent
          loanRequest={loanRequest}
          borrowers={requestBorrowers}
          offers={requestOffers}
          property={requestProperty}
          {...rest}
        />
      );
    }
  }

  RequestContainer.childContextTypes = contextTypes;

  return RequestContainer;
};

export default requestWrapper;
