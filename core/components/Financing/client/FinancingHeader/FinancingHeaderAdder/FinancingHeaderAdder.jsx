// @flow
import React from 'react';

import Button from '../../../../Button';
import Icon from '../../../../Icon';
import T from '../../../../Translation';
import FinancingHeaderAdderContainer from './FinancingHeaderAdderContainer';
import FinancingHeaderAdderDropdown from './FinancingHeaderAdderDropdown';

type FinancingHeaderAdderProps = {
  handleAdd: Function,
};

const FinancingHeaderAdder = ({
  handleAdd,
  isAdding,
  handleAddMaxStructure,
  isAddingMaxStructure,
  loan,
  openDialog,
  setDialogOpen
}: FinancingHeaderAdderProps) => (
  <div className="financing-structures-single-header structure structure-adder">
    {/* Add a span to absorb all CSS styles applied to direct children of .structure */}
    <span>
      <Button
        fab
        primary
        raised
        onClick={handleAdd}
        loading={isAdding}
        tooltip={<T id="FinancingHeaderAdder.label" />}
      >
        <Icon type="addBasic" />
      </Button>
      <FinancingHeaderAdderDropdown
        handleAddMaxStructure={handleAddMaxStructure}
        isLoading={isAddingMaxStructure}
        loan={loan}
        openDialog={openDialog}
        setDialogOpen={setDialogOpen}
      />
    </span>
  </div>
);

export default FinancingHeaderAdderContainer(FinancingHeaderAdder);
