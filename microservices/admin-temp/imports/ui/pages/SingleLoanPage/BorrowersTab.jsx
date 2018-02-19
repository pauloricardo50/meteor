import React from 'react';
import Tabs from 'core/components/Tabs';
import SingleBorrowerTab from './SingleBorrowerTab';

export default class BorrowersTab extends React.Component {
  getTabs = props => props.borrowers.map(borrower => ({
    id: borrower._id,
    label: `${borrower.firstName} ${borrower.lastName}`,
    content: <SingleBorrowerTab {...props} borrower={borrower} />,
  }));

  render() {
    const tabs = this.getTabs(this.props);

    return <Tabs tabs={tabs} />;
  }
}
