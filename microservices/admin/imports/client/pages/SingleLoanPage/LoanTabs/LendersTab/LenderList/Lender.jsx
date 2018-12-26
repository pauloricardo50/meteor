// @flow
import React from 'react';

import { LENDERS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';

type LenderProps = {};

const Lender = ({
  lender: {
    organisation: { name },
    status,
  },
}: LenderProps) => (
  <div className="lender">
    <div className="flex center">
      <h3>{name}</h3>
      <StatusLabel status={status} collection={LENDERS_COLLECTION} />
    </div>
  </div>
);

export default Lender;
