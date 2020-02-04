//      
import React from 'react';

import T from '../Translation';
import Select from '.';

                           

const makeOnChange = onChange => (prev, next) => {
  if (!prev.includes(null) && next.includes(null)) {
    // If previously a specific id was checked, and now you check "all" (i.e. null)
    // unselect all
    onChange(undefined);
    // dispatch({
    //   type: ACTIONS.SET_FILTER,
    //   payload: { name: filterName, value: undefined },
    // });
  } else if (prev.includes(null) && next.length > 1) {
    // If you previously had "all" checked, and check a specific checkbox,
    // uncheck "all" (i.e. null)
    onChange({ $in: next.filter(x => x) });

    // dispatch({
    //   type: ACTIONS.SET_FILTER,
    //   payload: { name: filterName, value: { $in: next.filter(x => x) } },
    // });
  } else {
    // Simple check
    onChange({ $in: next });
  }
};

const getOptions = (options, id) => {
  if (Array.isArray(options)) {
    return [{ id: null, label: 'Tous' }, ...options];
  }

  return [
    { id: null, label: 'Tous' },
    ...Object.values(options).map(value => ({
      id: value,
      label: <T id={`Forms.${id}.${value}`} />,
    })),
  ];
};

const MongoSelect = ({
  value,
  onChange,
  options,
  id,
  ...props
}                  ) => {
  const finalOptions = getOptions(options, id);
  const finalValue = value ? value.$in : [null];
  const finalOnChange = makeOnChange(onChange);

  return (
    <Select
      multiple
      value={finalValue}
      options={finalOptions}
      onChange={v => finalOnChange(finalValue, v)}
      id={id}
      {...props}
    />
  );
};
export default MongoSelect;
