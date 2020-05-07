import React from 'react';

import CheckboxList from 'core/components/Checkbox/CheckboxList';
import StickyPopover from 'core/components/StickyPopover';

const renderCheckboxValue = (values, options) =>
  values.map(i => {
    const value = options.find(({ id }) => id === i);
    return <div key={i}>{value?.label}</div>;
  });

const LoanBoardOptionsCheckboxes = ({ label, options, value, onChange }) => {
  const optionsToDisplay = options.filter(
    ({ hide, id }) => !hide || value.includes(id),
  );

  return (
    <div>
      <StickyPopover
        component={
          <CheckboxList
            value={value}
            options={optionsToDisplay}
            onChange={onChange}
            className="checkbox-list"
          />
        }
        placement="bottom"
      >
        <div>{label}</div>
      </StickyPopover>
      <div className="secondary">{renderCheckboxValue(value, options)}</div>
    </div>
  );
};

export default LoanBoardOptionsCheckboxes;
