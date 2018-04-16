import React from 'react';
import PropTypes from 'prop-types';

import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

const FormCheckbox = ({ input, meta: { touched, error }, label, required }) => (
  <FormControlLabel
    control={
      <Checkbox
        {...input}
        onChange={(event, isChecked) => input.onChange(isChecked)}
      />
    }
    label={
      required ? (
        <span>
          {label} <span className="error">*</span>
        </span>
      ) : (
        label
      )
    }
  />
);

FormCheckbox.propTypes = {
  input: PropTypes.object.isRequired,
};

export default FormCheckbox;
