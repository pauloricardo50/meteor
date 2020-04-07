import React from 'react';

import { formatMessage } from '../../../utils/server/intl';
import {
  getChecklistMissingInformations,
  isAnyBasicDocumentRequested,
} from '../helpers';
import LoanChecklistEmailSection from './LoanChecklistEmailSection';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

const LoanChecklistEmail = props => {
  const { fields, documents } = getChecklistMissingInformations(
    props,
    formatMessage,
  );

  return (
    <>
      <LoanChecklistEmailSection
        key="fields"
        missingInformations={fields}
        label={formatMessage({ id: 'LoanChecklist.missingFields' })}
      />
      <LoanChecklistEmailTable columns={[<span key="">&nbsp;</span>]} />
      <div className="separator" />
      <LoanChecklistEmailSection
        key="documents"
        missingInformations={documents}
        label={formatMessage({ id: 'LoanChecklist.missingDocuments' })}
      />
      {isAnyBasicDocumentRequested(documents) && (
        <>
          <div className="separator">
            <span className="basic">*&nbsp;</span>Documents essentiels pour la
            constitution du dossier
          </div>
        </>
      )}
    </>
  );
};

export default LoanChecklistEmail;
