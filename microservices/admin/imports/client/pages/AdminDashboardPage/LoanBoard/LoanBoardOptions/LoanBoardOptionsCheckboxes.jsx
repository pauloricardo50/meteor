// @flow
import React from 'react';

import StickyPopover from 'core/components/StickyPopover';
import CheckboxList from 'core/components/Checkbox/CheckboxList';

type LoanBoardOptionsCheckboxesProps = {};

const renderCheckboxValue = (values, options) =>
  values.map((i) => {
    const value = options.find(({ id }) => id === i);
    return <div key={i}>{value.label}</div>;
  });

const LoanBoardOptionsCheckboxes = ({
  label,
  options,
  value,
  onChange,
}: LoanBoardOptionsCheckboxesProps) => (
  <StickyPopover
    component={(
      <CheckboxList
        value={value}
        options={options}
        onChange={onChange}
        className="checkbox-list"
      />
    )}
    placement="top"
  >
    <div className="">
      <b>{label}</b>
      {renderCheckboxValue(value, options)}
    </div>
  </StickyPopover>
);

export default LoanBoardOptionsCheckboxes;
