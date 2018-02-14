import React from "react";
import queryString from "query-string";
import Tabs from "core/components/Tabs";
import SingleBorrowerTab from "./SingleBorrowerTab";

export default class BorrowersTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showObject: false };
    }

    getTabs = props => {
        return props.borrowers.map(borrower => ({
            id: borrower._id,
            label: borrower.firstName + " " + borrower.lastName,
            content: <SingleBorrowerTab {...props} borrower={borrower} />
        }));
    };

    render() {
        const { loan, borrowers, property, dataToPassDown } = this.props;
        const { showObject } = this.state;

        const tabs = this.getTabs(this.props);
        const initialTab = tabs.findIndex(
            tab => tab.id === queryString.parse(this.props.location.search).tab
        );

        return (
            <div>
                <Tabs initialIndex={initialTab} tabs={tabs} />
            </div>
        );
    }
}
