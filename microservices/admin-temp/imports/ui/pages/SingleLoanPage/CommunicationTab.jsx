import React from "react";

export default class CommunicationTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showObject: false };
    }

    render() {
        const { loan, borrowers, property, dataToPassDown } = this.props;
        const { showObject } = this.state;

        return <div />;
    }
}
