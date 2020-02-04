//      
import React from 'react';

import LoanChecklistSection from '../LoanChecklistSection';
import EmailLoanChecklist from './EmailLoanChecklist';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

                                       
                              
                
  

const LoanChecklistEmailSection = (props                                ) => {
  const { missingInformations = {}, label } = props;

  return (
    <>
      <LoanChecklistEmailTable
        columns={[
          <h3 className="section-title" key={label}>
            {label}
          </h3>,
        ]}
      />

      <LoanChecklistSection
        missingInformations={missingInformations}
        Component={EmailLoanChecklist}
      />
    </>
  );
};

export default LoanChecklistEmailSection;
