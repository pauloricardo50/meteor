// @flow
import React from 'react';
import cx from 'classnames';

import type { structureType } from '../../../../api/types';
import ClickToEditField from '../../../ClickToEditField';
import FinancingHeaderActions from './FinancingHeaderActions';
import FinancingSingleHeaderContainer from './FinancingSingleHeaderContainer';

type FinancingSingleHeaderProps = {
  structure: structureType,
  index: number,
  handleEditTitle: Function,
  handleEditDescription: Function,
  loanId: string,
  selected: boolean,
};

const FinancingSingleHeader = ({
  structure,
  index,
  handleEditTitle,
  handleEditDescription,
  loanId,
  selected,
}: FinancingSingleHeaderProps) => (
  <div
    className={cx(
      'financing-structures-single-header structure animated zoomIn',
      { selected },
    )}
  >
    <FinancingHeaderActions
      structureId={structure.id}
      loanId={loanId}
    />
    <h3>
      <ClickToEditField
        value={structure.name}
        placeholder={`Structure ${index + 1}`}
        onSubmit={handleEditTitle}
      />
    </h3>
    <span className="secondary">
      <ClickToEditField
        value={structure.description}
        placeholder="Description"
        onSubmit={handleEditDescription}
      />
    </span>
  </div>
);

export default FinancingSingleHeaderContainer(FinancingSingleHeader);
