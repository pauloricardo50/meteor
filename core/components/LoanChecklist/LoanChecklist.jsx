// @flow
import React from 'react';
import { injectIntl } from 'react-intl';

import T from '../Translation';
import { getChecklistMissingInformations } from './helpers';
import LoanChecklistSection from './LoanChecklistSection';

type LoanChecklistProps = {};

const LoanChecklist = (props: LoanChecklistProps) => {
  const { fields, documents } = getChecklistMissingInformations(props);

  return (
    <div className="loan-checklist">
      <LoanChecklistSection
        missingInformations={fields}
        label={<T id="LoanChecklist.missingFields" />}
      />
      <LoanChecklistSection
        missingInformations={documents}
        label={<T id="LoanChecklist.missingDocuments" />}
      />
    </div>
  );
};

export default injectIntl(LoanChecklist);
