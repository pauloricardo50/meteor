import React from 'react';
import PropTypes from 'prop-types';
import Overdrive from 'react-overdrive';

import Widget1SingleInput from '../Widget1SingleInput';
import Widget1SingleInputFormContainer from './Widget1SingleInputFormContainer';
import Widget1SingleInputFormButtons from './Widget1SingleInputFormButtons';

const Widget1SingleInputForm = ({
  name,
  onSubmit,
  onClick,
  isCurrentStep,
  value,
}) => (
  <div
    id={`widget1-${name}`}
    duration={200}
    className="widget1-single-input-form card1"
  >
    <form onSubmit={onSubmit}>
      <Widget1SingleInput name={name} />
      {isCurrentStep && (
        <Widget1SingleInputFormButtons
          disableEnter={!value}
          onClick={onClick}
        />
      )}
    </form>
  </div>
);

Widget1SingleInputForm.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  isCurrentStep: PropTypes.bool,
};

Widget1SingleInputForm.defaultProps = {
  onClick: () => {},
  isCurrentStep: true,
};

export default Widget1SingleInputFormContainer(Widget1SingleInputForm);
