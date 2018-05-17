import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { IntlNumber } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';

class SingleLoanPage extends Component {
  constructor(props) {
    super(props);
    this.state = { serverTime: new Date() };
  }

  componentDidMount() {
    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });
  }

  render() {
    const { loan } = this.props;

    const dataToPassDown = {
      ...this.props,
      loan,
      property: loan.property,
      borrowers: loan.borrowers,
      offers: loan.offers,
    };

    return (
      <section className="single-loan-page">
        <h1>
          {loan.name || 'Demande de Prêt'} - Emprunt de{' '}
          <IntlNumber
            value={getLoanValue({ loan, property: loan.property })}
            format="money"
          />
        </h1>
        <LoanTabs
          {...dataToPassDown}
          serverTime={this.state.serverTime}
          dataToPassDown={dataToPassDown}
        />
      </section>
    );
  }
}

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SingleLoanPageContainer(SingleLoanPage);
