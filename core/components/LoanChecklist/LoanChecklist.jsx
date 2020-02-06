import React from 'react';
import { injectIntl } from 'react-intl';

import T from '../Translation';
import {
  getChecklistMissingInformations,
  isAnyBasicDocumentRequested,
} from './helpers';
import LoanChecklistSection from './LoanChecklistSection';
import LoanChecklistList from './LoanChecklistList';

const LoanChecklist = ({ intl: { formatMessage }, ...props }) => {
  const { fields, documents } = getChecklistMissingInformations(
    props,
    formatMessage,
  );

  return (
    <div className="loan-checklist">
      <div className="loan-checklist-section">
        <h3>
          <T id="LoanChecklist.missingFields" />
        </h3>

        <LoanChecklistSection
          missingInformations={fields}
          Component={LoanChecklistList}
        />
      </div>

      <div className="loan-checklist-section">
        <h3>
          <T id="LoanChecklist.missingDocuments" />
        </h3>

        <LoanChecklistSection
          missingInformations={documents}
          Component={LoanChecklistList}
        />
      </div>
      {isAnyBasicDocumentRequested(documents) && (
        <div>
          <span className="error">*&nbsp;</span>Documents essentiels pour la
          constitution du dossier
        </div>
      )}
    </div>
  );
};

export default injectIntl(LoanChecklist);
