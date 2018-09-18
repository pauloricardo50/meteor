// @flow
import React from 'react';

import Button from '../../../Button';
import T from '../../../Translation';
import FinancingHeaderAdderContainer from './FinancingHeaderAdderContainer';

type FinancingHeaderAdderProps = {
  handleAdd: Function,
};

const FinancingHeaderAdder = ({
  handleAdd,
  isAdding,
}: FinancingHeaderAdderProps) => (
  <div className="financing-structures-single-header structure structure-adder">
    {/* Add a span to absorb all CSS styles applied to direct children of .structure */}
    <span>
      <Button primary raised onClick={handleAdd} loading={isAdding}>
        <T id="FinancingHeaderAdder.label" />
      </Button>
    </span>
  </div>
);

export default FinancingHeaderAdderContainer(FinancingHeaderAdder);
