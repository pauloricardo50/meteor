import React from 'react';

import BorrowerAdder from 'core/components/BorrowerAdder';
import Button from 'core/components/Button';
import { BorrowerForm } from 'core/components/forms';
import Icon from 'core/components/Icon';
import Tabs from 'core/components/Tabs';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

const Borrower = withTranslationContext(({ borrower }) => ({
  gender: borrower.gender,
}))(BorrowerForm);

const getTabs = ({ borrowers, insuranceRequest, userId }) =>
  [
    ...borrowers.map((borrower, index) => ({
      id: borrower._id,
      label: borrower.name || `Assuré ${index + 1}`,
      content: <Borrower borrower={borrower} />,
    })),
    borrowers.length < 2 && {
      id: 'borrowerAdder',
      label: (
        <BorrowerAdder
          insuranceRequestId={insuranceRequest._id}
          userId={userId}
          TriggerComponent={
            <Button
              fab
              primary
              label=""
              icon={<Icon type="add" fontSize="small" />}
              className="ml-8"
              size="small"
              tooltip="Ajouter un assuré"
            />
          }
        />
      ),
    },
  ].filter(x => x);

const BorrowersTab = props => {
  const { insuranceRequest } = props;
  const {
    borrowers = [],
    _id: insuranceRequestId,
    user: { _id: userId } = {},
  } = insuranceRequest;

  if (!borrowers.length) {
    return (
      <div className="flex-col center center-align">
        <Icon
          type="people"
          style={{ width: '50px', height: '50px', color: 'rgba(0,0,0,0.5)' }}
        />
        <h3 className="secondary">Aucun assuré pour l'instant</h3>
        <BorrowerAdder
          insuranceRequestId={insuranceRequestId}
          userId={userId}
        />
      </div>
    );
  }

  const tabs = getTabs({ borrowers, insuranceRequest, userId });

  return <Tabs tabs={tabs} disableTouchRipple />;
};

export default BorrowersTab;
