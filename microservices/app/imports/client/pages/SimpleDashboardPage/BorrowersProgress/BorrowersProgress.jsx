// @flow
import React from 'react';

import T from 'core/components/Translation';

type BorrowersProgressProps = {};

const BorrowersProgress = (props: BorrowersProgressProps) => (
  <div className="borrowers-progress">
    <h3>
      <T id="BorrowersProgress.title" />
    </h3>
  </div>
);

export default BorrowersProgress;
