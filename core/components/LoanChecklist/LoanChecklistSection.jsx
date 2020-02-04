//      
import React from 'react';

                                  
                              
                        
  

const LoanChecklistSection = ({
  missingInformations: { property = {}, borrowers = [] } = {},
  Component,
}                           ) => (
  <>
    {!!Object.keys(property).length && (
      <Component title={property.title} labels={property.labels} />
    )}
    {borrowers.map(borrower => (
      <Component
        key={borrower.title}
        title={borrower.title}
        labels={borrower.labels}
      />
    ))}
  </>
);

export default LoanChecklistSection;
