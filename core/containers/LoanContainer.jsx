import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const contextTypes = {
  loan: PropTypes.object,
  borrowers: PropTypes.array,
  offers: PropTypes.array,
  property: PropTypes.object,
};

const loanWrapper = (WrappedComponent) => {
  class LoanContainer extends Component {
    constructor(props) {
      super();
      this.state = { ...this.getData(props) };
    }

    getChildContext() {
      const {
        loan,
        loanBorrowers,
        loanOffers,
        loanProperty,
      } = this.state;

      return {
        loan,
        borrowers: loanBorrowers,
        offers: loanOffers,
        property: loanProperty,
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ ...this.getData(nextProps) });
    }

    getData = (props) => {
      const {
        loans, borrowers, properties, offers, ...rest
      } = props;

      // match has to be passed to children
      const { loanId } = props.match.params;

      let loan = {};
      let loanBorrowers = [];
      let loanOffers = [];
      let loanProperty = {};

      if (loanId) {
        loan =
          loans &&
          loans.find(loan => loan._id === loanId);
        loanBorrowers =
          loan &&
          loan.borrowers.map(borrowerId =>
            borrowers.find(borrower => borrower._id === borrowerId));
        loanOffers =
          offers && offers.filter(offer => offer.loanId === loanId);
        loanProperty =
          properties &&
          properties.find((property) => {
            // Add this check while transitioning from nested to separate property
            if (typeof loan.property === 'string') {
              return property._id === loan.property;
            }

            return false;
          });
      }

      return {
        loan,
        loanBorrowers,
        loanOffers,
        loanProperty,
        rest,
      };
    };

    render() {
      const {
        loan,
        loanBorrowers,
        loanOffers,
        loanProperty,
        rest,
      } = this.state;

      return (
        <WrappedComponent
          loan={loan}
          borrowers={loanBorrowers}
          offers={loanOffers}
          property={loanProperty}
          {...rest}
        />
      );
    }
  }

  LoanContainer.childContextTypes = contextTypes;

  return LoanContainer;
};

export default loanWrapper;
