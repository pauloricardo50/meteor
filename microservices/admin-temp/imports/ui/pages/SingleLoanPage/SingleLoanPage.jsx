import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

import Button from "core/components/Button";

import { getLoanValue } from "core/utils/loanFunctions";
import { IntlNumber } from "core/components/Translation";

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
                <Button
                    raised
                    label="Retour"
                    style={styles.returnButton}
                    onClick={() => history.push("/loans")}
                />
                <div className="mask1">
                    <h1>
                        {loan.name || "Demande de Prêt"} - Emprunt de{" "}
                        <IntlNumber
                            value={getLoanValue({
                                loan,
                                property: loan.propertyLink
                            })}
                            format="money"
                        />
                    </h1>

                    <StepStatus
                        {...dataToPassDown}
                        serverTime={this.state.serverTime}
                    />

                    <FileVerificationNotification
                        loan={loan}
                        borrowers={loan.borrowersLink}
                    />

                    <LoanTabs
                        {...dataToPassDown}
                        serverTime={this.state.serverTime}
                    />
                </div>
            </section>
        );
    }
}

// SingleLoanPage.propTypes = {
// };
