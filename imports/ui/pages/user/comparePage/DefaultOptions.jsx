import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '/imports/ui/components/general/TextInput.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import BorrowerOptions from './BorrowerOptions.jsx';

const textFields = [
  { id: 'income', type: 'money' },
  { id: 'fortune', type: 'money' },
  { id: 'interestRate', type: 'percent' },
];

const DefaultOptions = ({ options, changeOptions }) => {
  if (options.useBorrowers) {
    return <BorrowerOptions />;
  }

  return (
    <div className="flex-col center">
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {textFields.map(({ id, type }) =>
          (<TextInput
            key={id}
            label={<T id={`DefaultOptions.${id}`} />}
            id={id}
            handleChange={changeOptions}
            currentValue={options[id]}
            floatingLabelFixed
            type={type}
            style={{ width: 160, marginRight: 16 }}
          />),
        )}
      </div>
    </div>
  );
};

DefaultOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  changeOptions: PropTypes.func.isRequired,
};

export default DefaultOptions;
