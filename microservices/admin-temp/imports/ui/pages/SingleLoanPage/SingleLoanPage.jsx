import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import LoanTabs from './LoanTabs';

export default class SingleLoanPage extends Component {
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
    console.log('Single loan page props:', this.props);

    const { data, isLoading } = this.props;
    const loan = data;

    if (isLoading || !loan) return null;

    const dataToPassDown = {
      ...this.props,
      loan,
      property: loan.property,
      borrowers: loan.borrowers,
    };

    return (
      <section className="single-loan-page">
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
};
