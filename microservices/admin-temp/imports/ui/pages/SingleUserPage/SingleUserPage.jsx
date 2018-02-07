import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

import moment from 'moment';

import Loan from './Loan';

const styles = {
    createdAt: {
        marginBottom: 32
    }
};

export default class SingleLoanPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { history, data, isLoading } = this.props;
        const user = data;

        if (isLoading || !user) return null;

        const loans = data.loansLink;

        return (
            <section className="mask1">
                <h1>{user.emails[0].address}</h1>
                <p className="secondary" style={styles.createdAt}>
                    Créé le {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
                </p>

                <h3>Demandes de prêt</h3>
                {loans && loans.map(loan => (
                    <Loan
                        loan={loan}
                        key={loan._id}
                        history={history}
                        borrowers={loan.borrowersLink}
                        property={loan.propertyLink}
                        //borrowers={borrowers.filter(b => loan.borrowers.indexOf(b._id) >= 0)}
                        //property={properties.find(p => p._id === loan.property)}
                    />
                ))}
            </section>
        );
    }
}

