// @flow
import React from 'react';
import omit from 'lodash/omit';

import { BorrowerSchemaAdmin } from 'core/api/borrowers/schemas/BorrowerSchema';
import { borrowerUpdate, mortgageNoteInsert } from 'core/api';
import AutoForm from '../AutoForm2';
import MortgageNotesForm from './MortgageNotesForm';
import Box from '../Box';

type BorrowerFormProps = {};

export const personalFields = [
  'firstName',
  'lastName',
  'gender',
  'birthDate',
  'sameAddress',
  'address1',
  'address2',
  'zipCode',
  'city',
  'country',
  'email',
  'phoneNumber',
  'isSwiss',
  'residencyPermit',
  'citizenship',
  'isUSPerson',
  'civilStatus',
  'marriedDate',
  'divorcedDate',
  'childrenCount',
  'company',
  'job',
  'jobStartDate',
  'jobActivityRate',
  'worksInSwitzerlandSince',
];
export const financeFields = [
  'salary',
  'netSalary',
  'bonusExists',
  'bonus2015',
  'bonus2016',
  'bonus2017',
  'bonus2018',
  'bonus2019',
  'otherIncome',
  'otherFortune',
  'expenses',
  'bankFortune',
  'realEstate',
  'insurance2',
  'insurance3A',
  'insurance3B',
  'bank3A',
  'donation',
  'hasOwnCompany',
  'ownCompanies',
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

const handleSubmit = borrowerId => doc => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return borrowerUpdate.run({
        borrowerId,
        object: omit(doc, omittedFields),
      });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Enregistré', 2));
};

const insertMortgageNote = borrowerId => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return mortgageNoteInsert.run({ borrowerId });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Enregistré', 2));
};

const BorrowerForm = ({ borrower }: BorrowerFormProps) => {
  const { mortgageNotes, _id: borrowerId } = borrower;
  return (
    <div className="borrower-admin-form">
      <h3>Informations personnelles</h3>
      <AutoForm
        schema={BorrowerSchemaAdmin.pick(...personalFields)}
        model={borrower}
        onSubmit={handleSubmit(borrowerId)}
        className="form"
        layout={[
          {
            fields: [
              'firstName',
              'lastName',
              'gender',
              'birthDate',
              'civilStatus',
              'marriedDate',
              'divorcedDate',
              'childrenCount',
              'company',
              'job',
              'worksInSwitzerlandSince',
              'jobStartDate',
              'jobActivityRate',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: [
              'sameAddress',
              'address1',
              'address2',
              'zipCode',
              'city',
              'country',
              'email',
              'phoneNumber',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: ['isSwiss', 'residencyPermit', 'citizenship', 'isUSPerson'],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: '__REST',
            className: 'grid-col',
          },
        ]}
      />
      <h3>Informations financières</h3>
      <AutoForm
        schema={BorrowerSchemaAdmin.pick(...financeFields)}
        model={borrower}
        onSubmit={handleSubmit(borrowerId)}
        className="form"
        layout={[
          {
            fields: ['salary', 'netSalary', 'otherIncome'],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            Component: Box,
            fields: ['bonusExists'],
            layout: [{ fields: ['bonus*'], className: 'grid-col mb-32' }],
            className: 'mb-32',
          },
          {
            fields: ['expenses'],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            Component: Box,
            fields: ['bankFortune', 'donation', 'otherFortune', 'realEstate'],
            className: 'grid-col mb-32',
          },
          {
            Component: Box,
            fields: ['insurance2', 'bank3A', 'insurance3A', 'insurance3B'],
            className: 'grid-col mb-32',
          },
          {
            Component: Box,
            fields: ['hasOwnCompany', 'ownCompanies'],
            className: 'grid-col mb-32',
          },
          {
            fields: '__REST',
            className: 'grid-col',
          },
        ]}
      />
      {otherSchema._schemaKeys.length > 0 && (
        <>
          <h3>Autres</h3>
          <AutoForm
            schema={otherSchema}
            model={borrower}
            onSubmit={handleSubmit(borrowerId)}
            className="form"
          />
        </>
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
