// @flow
import React from 'react';

import Lender from './Lender';

type LenderListProps = {};

const LenderList = ({ loan: { lenders = [] } }: LenderListProps) => (
  <div className="lenders-list flex wrap">
    {lenders.map(lender => (
      <Lender key={lender._id} lender={lender} />
    ))}
  </div>
);

export default LenderList;
