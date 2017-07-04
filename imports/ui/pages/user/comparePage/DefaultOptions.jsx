import React from 'react';
import PropTypes from 'prop-types';

import InputMoney from '/imports/ui/components/general/InputMoney.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import BorrowerOptions from './BorrowerOptions.jsx';

const textFields = ['income', 'fortune'];

const DefaultOptions = ({ options, changeOptions }) => {
  if (options.useBorrowers) {
    return <BorrowerOptions />;
  }

  return (
    <div
      style={{
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {textFields.map(field =>
        (<InputMoney
          key={field}
          label={<T id={`DefaultOptions.${field}`} />}
          id={field}
          handleChange={changeOptions}
          currentValue={options[field]}
          floatingLabelFixed
        />),
      )}
    </div>
  );
};

DefaultOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  changeOptions: PropTypes.func.isRequired,
};

export default DefaultOptions;
