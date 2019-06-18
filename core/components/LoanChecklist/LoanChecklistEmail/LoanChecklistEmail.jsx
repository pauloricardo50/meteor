// @flow
import React from 'react';
import { getChecklistMissingInformations } from '../helpers';
import styles from './styles';
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
      <head>
        <style>{styles}</style>
      </head>
      <body>
        <LoanChecklistEmailTable
          columns={[
            <>
              <LoanChecklistEmailTable
                columns={[
                  <LoanChecklistEmailSection
                    key="fields"
                    missingInformations={fields}
                    label={formatMessage({ id: 'LoanChecklist.missingFields' })}
                    formatMessage={formatMessage}
                  />,
                ]}
              />
              <LoanChecklistEmailTable
                columns={[
                  <LoanChecklistEmailSection
                    key="documents"
                    missingInformations={documents}
                    label={formatMessage({
                      id: 'LoanChecklist.missingDocuments',
                    })}
                    formatMessage={formatMessage}
                  />,
                ]}
              />
            </>,
          ]}
        />
      </body>
    </>
  );
};

export default LoanChecklistEmail;
