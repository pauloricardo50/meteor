import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';

import List from 'core/components/Material/List';
import ListItem from 'core/components/Material/ListItem';
import StickyPopover from 'core/components/StickyPopover';

const renderValue = (value, options) => {
  if (!Array.isArray(value)) {
    const option = options.find(({ id }) => id === value);
    return option.label;
  }

  return value.map(i => {
    const option = options.find(({ id }) => id === i);
    return <div key={i}>{option?.label}</div>;
  });
};

const handleClick = ({ onChange, value, id, selected, multiple }) => {
  if (!multiple) {
    if (!selected) {
      onChange(id);
    }
    return;
  }

  if (!selected && !value.includes(id)) {
    onChange([...value, id]);
  } else if (selected) {
    onChange(value.filter(item => item !== id));
  }
};

const LoanBoardOptionsSelect = ({
  label,
  options,
  value,
  onChange,
  multiple = true,
}) => {
  const optionsToDisplay = options.filter(
    ({ hide, id }) => !hide || value.includes(id),
  );

  return (
    <div>
      <StickyPopover
        component={
          <List>
            {optionsToDisplay.map(({ id, label: optionLabel }) => {
              const selected = value.includes(id);
              return (
                <ListItem
                  button
                  key={id}
                  selected={selected}
                  onClick={() =>
                    handleClick({
                      onChange,
                      value,
                      id,
                      selected,
                      multiple,
                    })
                  }
                >
                  <ListItemText primary={optionLabel} />
                </ListItem>
              );
            })}
          </List>
        }
        placement="bottom"
        paperProps={{
          style: { padding: '1px 0', maxHeight: 400, overflowY: 'scroll' },
        }}
      >
        <div style={{ cursor: 'pointer' }}>{label}</div>
      </StickyPopover>
      <div className="secondary">{renderValue(value, options)}</div>
    </div>
  );
};

export default LoanBoardOptionsSelect;
