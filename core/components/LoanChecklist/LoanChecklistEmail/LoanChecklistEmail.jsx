// @flow
import React from 'react';
import { getChecklistMissingInformations } from '../helpers';
import LoanChecklistEmailSection from './LoanChecklistEmailSection';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

type LoanChecklistEmailProps = {};

const LoanChecklistEmail = (props: LoanChecklistEmailProps) => {
  const {
    intl: { formatMessage },
  } = props;
  const { fields, documents } = getChecklistMissingInformations(props);

  return (
    <>
      <LoanChecklistEmailSection
        key="fields"
        missingInformations={fields}
        label={formatMessage({ id: 'LoanChecklist.missingFields' })}
        formatMessage={formatMessage}
      />
      <LoanChecklistEmailTable columns={[<span>&nbsp;</span>]} />
      <div className="separator" />
      <LoanChecklistEmailSection
        key="documents"
        missingInformations={documents}
        label={formatMessage({
          id: 'LoanChecklist.missingDocuments',
        })}
        formatMessage={formatMessage}
      />
    </>
  );
};

export default LoanChecklistEmail;
