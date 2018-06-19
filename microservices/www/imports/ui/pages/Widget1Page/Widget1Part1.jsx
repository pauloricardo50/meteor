import React from 'react';
import PropTypes from 'prop-types';

import Widget1SingleInputForm from './Widget1SingleInputForm';

const Widget1Part1 = ({ step, fields }) => (
  <div className="widget1-part-1">
    {fields.map((field, index) =>
      (step >= index ? (
        <Widget1SingleInputForm
          key={field}
          name={field}
          isCurrentStep={step === index}
        />
      ) : (
        <div className="input-form-placeholder" key={field} />
      )))}
  </div>
);

Widget1Part1.propTypes = {
  step: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Widget1Part1;
