import React from 'react';
import Tabs from 'core/components/Tabs';
import SingleBorrowerTab from './SingleBorrowerTab';

export default class BorrowersTab extends React.Component {
  getTabs = props =>
    props.borrowers.map((borrower, i) => ({
      id: borrower._id,
      label:
        borrower.firstName || borrower.lastName
          ? `${borrower.firstName} ${borrower.lastName}`
          : `Emprunteur ${i + 1}`,
      content:
  <SingleBorrowerTab {...props} borrower={borrower} key={borrower._id} />
      ,
    }));

  render() {
    const tabs = this.getTabs(this.props);

    return <Tabs tabs={tabs} />;
  }
}
