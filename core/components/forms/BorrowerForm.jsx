// @flow
import React from 'react';
import omit from 'lodash/omit';

import { BorrowerSchemaAdmin } from 'core/api/borrowers/schemas/BorrowerSchema';
import { borrowerUpdate, mortgageNoteInsert } from 'core/api';
import message from 'core/utils/message';
import AutoForm from '../AutoForm2';
import MortgageNotesForm from './MortgageNotesForm';

type BorrowerFormProps = {};

const personalFields = [
  'firstName',
  'lastName',
  'gender',
  'age',
  'sameAddress',
  'address1',
  'address2',
  'zipCode',
  'city',
  'isSwiss',
  'residencyPermit',
  'citizenship',
  'isUSPerson',
  'civilStatus',
  'childrenCount',
  'company',
];
const financeFields = [
  'salary',
  'bonusExists',
  'bonus2015',
  'bonus2016',
  'bonus2017',
  'bonus2018',
  'otherIncome',
  'otherFortune',
  'expenses',
  'bankFortune',
  'realEstate',
  'insurance2',
  'insurance3A',
  'insurance3B',
  'bank3A',
  'thirdPartyFortune',
];

const omittedFields = [
  'loans',
  'user',
  'documents',
  'additionalDocuments',
  'mortgageNotes',
  'mortgageNoteLinks',
  'canton',
];

const otherSchema = BorrowerSchemaAdmin.omit(
  ...personalFields,
  ...financeFields,
  ...omittedFields,
);

const handleSubmit = borrowerId => (doc) => {
  const hideLoader = message.loading('...', 0);
  return borrowerUpdate
    .run({ borrowerId, object: omit(doc, omittedFields) })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const insertMortgageNote = (borrowerId) => {
  const hideLoader = message.loading('...', 0);
  return mortgageNoteInsert
    .run({ borrowerId })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const BorrowerForm = ({ borrower }: BorrowerFormProps) => {
  const { mortgageNotes, _id: borrowerId } = borrower;
  return (
    <div className="borrower-admin-form">
      <div>
        <h3>Informations personelles</h3>
        <AutoForm
          schema={BorrowerSchemaAdmin.pick(...personalFields)}
          model={borrower}
          onSubmit={handleSubmit(borrowerId)}
          className="form"
        />
      </div>
      <div>
        <h3>Informations financières</h3>
        <AutoForm
          schema={BorrowerSchemaAdmin.pick(...financeFields)}
          model={borrower}
          onSubmit={handleSubmit(borrowerId)}
          className="form"
        />
      </div>
      {otherSchema._schemaKeys.length > 0 && (
        <div>
          <h3>Autres</h3>
          <AutoForm
            schema={otherSchema}
            model={borrower}
            onSubmit={handleSubmit(borrowerId)}
            className="form"
          />
        </div>
      )}
      <MortgageNotesForm
        mortgageNotes={mortgageNotes}
        insertMortgageNote={insertMortgageNote}
        id={borrowerId}
        withCanton
      />
    </div>
  );
};

export default BorrowerForm;
