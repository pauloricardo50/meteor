import React from 'react';
import PropTypes from 'prop-types';
import Tabs from 'core/components/Tabs';

import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from 'core/api/constants';
import {
  loanDocuments,
  borrowerDocuments,
  propertyDocuments,
} from 'core/api/files/documents';
import FilesVerificationTab from './FilesVerificationTab';

const FilesVerification = ({ loan, borrowers, property }) => (
  <Tabs
    id="file-verification-tabs"
    tabs={[
      {
        label: 'Prêt Hypothécaire',
        doc: loan,
        documentArray: loanDocuments(loan).all(),
        collection: LOANS_COLLECTION,
        closingSteps: loan.logic.closingSteps,
      },
      {
        label: 'Bien Immobilier',
        doc: property,
        documentArray: propertyDocuments(property).all(),
        collection: PROPERTIES_COLLECTION,
      },
      ...borrowers.map(borrower => ({
        label: borrower.firstName,
        doc: borrower,
        documentArray: borrowerDocuments(borrower).all(),
        collection: BORROWERS_COLLECTION,
      })),
    ].map(({ label, doc, ...rest }, index) => ({
      label,
      content:
  <FilesVerificationTab key={doc._id} doc={doc} index={index} {...rest} />
      ,
    }))}
  />
);

FilesVerification.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesVerification;
