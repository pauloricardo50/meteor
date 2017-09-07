import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '/imports/ui/components/general/TextInput';
import { T } from '/imports/ui/components/general/Translation';
import BorrowerOptions from './BorrowerOptions';

const textFields = [
  { id: 'income', type: 'money' },
  { id: 'fortune', type: 'money' },
  { id: 'interestRate', type: 'percent' },
];

const DefaultOptions = ({ comparator, changeComparator }) => {
  if (comparator.useBorrowers) {
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
            handleChange={changeComparator}
            currentValue={comparator[id]}
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
  comparator: PropTypes.objectOf(PropTypes.any).isRequired,
  changeComparator: PropTypes.func.isRequired,
};

export default DefaultOptions;
