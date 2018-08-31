import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
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
      ...borrowers.map((borrower, index) => ({
        label: borrower.firstName || `Emprunteur ${index + 1}`,
        doc: borrower,
        documentArray: borrowerDocuments(borrower).all(),
        collection: BORROWERS_COLLECTION,
      })),

      {
        label: <T id="general.property" />,
        doc: property,
        documentArray: propertyDocuments(property).all(),
        collection: PROPERTIES_COLLECTION,
      },
      {
        label: <T id="FileTabs.loanDocuments" />,
        doc: loan,
        documentArray: loanDocuments(loan).all(),
        collection: LOANS_COLLECTION,
        closingSteps: loan.logic.closingSteps,
      },
    ].map(({ label, doc, ...rest }, index) => ({
      label,
      content: (
        <FilesVerificationTab key={doc._id} doc={doc} index={index} {...rest} />
      ),
    }))}
  />
);

FilesVerification.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesVerification;
