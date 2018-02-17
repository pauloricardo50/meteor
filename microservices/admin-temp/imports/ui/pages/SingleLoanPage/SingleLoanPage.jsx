import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import LoanTabs from './LoanTabs';

export default class SingleLoanPage extends Component {
    componentDidMount() {
        Meteor.call('getServerTime', (e, res) => {
            this.setState({ serverTime: res });
        });
    }

    render() {
        const { data, isLoading } = this.props;
        const loan = data;

        if (isLoading || !loan) return null;

        const dataToPassDown = {
            ...this.props,
            loan,
            property: loan.propertyLink,
            borrowers: loan.borrowersLink
        };

        return (
            <section>
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
    isLoading: PropTypes.bool.isRequired
};
