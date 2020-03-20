import React from 'react';
import { BorrowerForm } from 'core/components/forms';
import Tabs from 'core/components/Tabs';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { insuranceRequestInsertBorrower } from 'core/api/insuranceRequests/methodDefinitions';

const Borrower = withTranslationContext(({ borrower }) => ({
  gender: borrower.gender,
}))(BorrowerForm);

const getTabs = ({ borrowers, insuranceRequestId }) =>
  [
    ...borrowers.map((borrower, index) => ({
      id: borrower._id,
      label: borrower.name || `Assuré ${index + 1}`,
      content: <Borrower borrower={borrower} />,
    })),
    borrowers.length < 2 && {
      id: 'borrowerAdder',
      label: (
        <Button
          fab
          primary
          label=""
          icon={<Icon type="add" />}
          className="ml-8"
          size="small"
          tooltip="Ajouter un assuré"
          onClick={() =>
            insuranceRequestInsertBorrower.run({ insuranceRequestId })
          }
        />
      ),
    },
  ].filter(x => x);

const BorrowersTab = props => {
  const {
    insuranceRequest: { borrowers = [], _id: insuranceRequestId },
  } = props;

  if (!borrowers.length) {
    return (
      <div className="flex-col center center-align">
        <p>Aucun assuré pour l'instant</p>
        <div className="flex center-align">
          <Button
            primary
            raised
            label="Ajouter un assuré"
            icon={<Icon type="person" />}
            className="ml-8"
            size="small"
            tooltip="Ajouter un assuré"
            onClick={() =>
              insuranceRequestInsertBorrower.run({ insuranceRequestId })
            }
          />
          <Button
            primary
            raised
            label="Ajouter deux assurés"
            icon={<Icon type="people" />}
            className="ml-8"
            size="small"
            tooltip="Ajouter deux assuré"
            onClick={() =>
              insuranceRequestInsertBorrower.run({
                insuranceRequestId,
                amount: 2,
              })
            }
          />
        </div>
      </div>
    );
  }

  const tabs = getTabs({ borrowers, insuranceRequestId });

  return <Tabs tabs={tabs} disableTouchRipple />;
};

export default BorrowersTab;
