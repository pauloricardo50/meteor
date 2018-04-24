import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'react-bootstrap/lib/Tabs';

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
  <Tabs defaultActiveKey={0} id="tabs">
    {[
      {
        title: 'Prêt Hypothécaire',
        doc: loan,
        documentArray: loanDocuments(loan).all(),
        collection: LOANS_COLLECTION,
        closingSteps: loan.logic.closingSteps,
      },
      {
        title: 'Bien Immobilier',
        doc: property,
        documentArray: propertyDocuments(property).all(),
        collection: PROPERTIES_COLLECTION,
      },
      ...borrowers.map(borrower => ({
        title: borrower.firstName,
        doc: borrower,
        documentArray: borrowerDocuments(borrower).all(),
        collection: BORROWERS_COLLECTION,
      })),
    ].map(({ doc, ...rest }, index) => (
      <FilesVerificationTab key={doc._id} doc={doc} index={index} {...rest} />
    ))}
  </Tabs>
);

FilesVerification.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesVerification;
