import React from "react";

export default class BorrowerTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showObject: false };
    }

    render() {
        const { borrower } = this.props;
        const { showObject } = this.state;

        return (
            <div>
                <h1>{borrower.firstName || borrower.lastName}</h1>
            </div>
        );
    }
}
