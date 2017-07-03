import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';

import MaskedInput from 'react-text-mask';
import { swissFrancMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import BorrowerOptions from './BorrowerOptions.jsx';

const textFields = ['income', 'fortune'];

const DefaultOptions = ({ options, changeOptions }) => {
  if (options.useBorrowers) {
    return <BorrowerOptions />;
  }
  console.log(options);
  return (
    <div>
      {textFields.map(field =>
        (<TextField
          label={`DefaultOptions.${field}`}
          key={field}
          id={field}
          type="text"
          onChange={e => changeOptions(field, toNumber(e.target.value))}
        >
          <MaskedInput
            value={options[field]}
            mask={swissFrancMask}
            guide
            pattern="[0-9]*"
          />
        </TextField>),
      )}
    </div>
  );
};

DefaultOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  changeOptions: PropTypes.func.isRequired,
};

export default DefaultOptions;
