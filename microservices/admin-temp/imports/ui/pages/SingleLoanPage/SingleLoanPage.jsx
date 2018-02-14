import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

import LoanTabs from "./LoanTabs";
import StepStatus from "./StepStatus";
import FileVerificationNotification from "./FileVerificationNotification";

const styles = {
    actions: {
        margin: "80px 0"
    },
    returnButton: {
        marginBottom: 20
    },
    recapDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 20px"
    }
};

export default class SingleLoanPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showObject: false,
            showOffers: false,
            servertime: undefined
        };
    }

    componentDidMount() {
        Meteor.call("getServerTime", (e, res) => {
            this.setState({ serverTime: res });
        });
    }

    render() {
        const { history, data, isLoading } = this.props;
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
