//      
import React from 'react';

import Lender from './Lender';

                          

const LenderList = ({ loan: { lenders = [] } }                 ) => {
  if (lenders.length === 0) {
    return <h3 className="secondary text-center">Pas encore de prêteurs</h3>;
  }

  return (
    <div className="lenders-list flex wrap">
      {lenders.map(lender => (
        <Lender key={lender._id} lender={lender} />
      ))}
    </div>
  );
};

export default LenderList;
