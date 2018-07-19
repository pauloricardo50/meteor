// @flow
import React from 'react';

import Button from '../../../Button';
import T from '../../../Translation';
import FinancingStructuresHeaderAdderContainer from './FinancingStructuresHeaderAdderContainer';

type FinancingStructuresHeaderAdderProps = {
  handleAdd: Function,
};

const FinancingStructuresHeaderAdder = ({
  handleAdd,
}: FinancingStructuresHeaderAdderProps) => (
  <div className="financing-structures-single-header structure structure-adder">
    {/* Add a span to absorb all CSS styles applied to direct children of .structure */}
    <span>
      <Button primary raised onClick={handleAdd}>
        <T id="FinancingStructuresHeaderAdder.label" />
      </Button>
    </span>
  </div>
);

export default FinancingStructuresHeaderAdderContainer(FinancingStructuresHeaderAdder);
