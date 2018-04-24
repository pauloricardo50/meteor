import React from 'react';
import PropTypes from 'prop-types';

import { SALARY, FORTUNE, PROPERTY } from '../../../redux/reducers/widget1';
import Widget1SingleInputForm from './Widget1SingleInputForm';

const fields = [SALARY, FORTUNE, PROPERTY];

const Widget1Part1 = ({ step }) => (
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
};

export default Widget1Part1;
