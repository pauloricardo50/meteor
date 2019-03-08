// @flow
import React from 'react';
import cx from 'classnames';

import ClickToEditField from '../../../ClickToEditField';
import Icon from '../../../Icon';
import T from '../../../Translation';
import FinancingHeaderActions from './FinancingHeaderActions';
import FinancingSingleHeaderContainer from './FinancingSingleHeaderContainer';

type FinancingSingleHeaderProps = {
  structure: Object,
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
    {structure.disabled && (
      <Icon
        type="lock"
        tooltip={<T id="Financing.disabledTooltip" />}
        className="disabled-icon"
      />
    )}
    <FinancingHeaderActions
      structureId={structure.id}
      loanId={loanId}
      structure={structure}
      selected={selected}
    />
    <h3>
      <ClickToEditField
        value={structure.name}
        placeholder={`Structure ${index + 1}`}
        onSubmit={handleEditTitle}
        disabled={structure.disableForms}
      />
    </h3>
    <span className="secondary">
      <ClickToEditField
        value={structure.description}
        placeholder="Description"
        onSubmit={handleEditDescription}
        disabled={structure.disableForms}
      />
    </span>
  </div>
);

export default FinancingSingleHeaderContainer(FinancingSingleHeader);
