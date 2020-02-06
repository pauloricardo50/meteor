//
import React from 'react';

import PercentWithStatus from 'core/components/PercentWithStatus';
import T from 'core/components/Translation';

const BorrowersCardHeader = ({ progress }) => (
  <div className="borrowers-card-header">
    <div style={{ width: '100%' }}>
      <div className="flex-row title">
        <h3 className="flex-row">
          <T id="collections.borrowers" />
          &nbsp;-&nbsp;
          <PercentWithStatus
            value={progress}
            status={progress < 1 ? null : undefined}
            rounded
          />
        </h3>
      </div>
    </div>
  </div>
);

export default BorrowersCardHeader;
