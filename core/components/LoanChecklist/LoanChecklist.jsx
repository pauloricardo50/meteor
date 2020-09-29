import React from 'react';
import { useIntl } from 'react-intl';

import T from '../Translation';
import {
  getChecklistMissingInformations,
  isAnyBasicDocumentRequested,
} from './helpers';
import LoanChecklistList from './LoanChecklistList';
import LoanChecklistSection from './LoanChecklistSection';

const LoanChecklist = props => {
  const { formatMessage } = useIntl();
  const { fields, documents } = getChecklistMissingInformations(
    props,
    formatMessage,
  );

  return (
    <div className="loan-checklist">
      <div className="loan-checklist-section">
        <h3>
          <T defaultMessage="Informations manquantes" />
        </h3>

        <LoanChecklistSection
          missingInformations={fields}
          Component={LoanChecklistList}
        />
      </div>

      <div className="loan-checklist-section">
        <h3>
          <T defaultMessage="Documents manquants" />
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

export default LoanChecklist;
