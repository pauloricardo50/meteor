import React from 'react';
import PropTypes from 'prop-types';
import Overdrive from 'react-overdrive';

import Button from 'core/components/Button';
import Widget1SingleInput from '../Widget1SingleInput';
import Widget1SingleInputFormContainer from './Widget1SingleInputFormContainer';

const Widget1SingleInputForm = ({ name, onSubmit, onClick }) => (
  <Overdrive
    id={`widget1-${name}`}
    duration={300}
    className="widget1-single-input-form card1"
  >
    <form onSubmit={onSubmit}>
      <Widget1SingleInput name={name} />
      <Button color="primary" type="submit" onClick={onClick}>
        Entrer
      </Button>
      <Button onClick={onClick}>Je ne sais pas</Button>
    </form>
  </Overdrive>
);

Widget1SingleInputForm.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

Widget1SingleInputForm.defaultProps = {
  onClick: () => {},
};

export default Widget1SingleInputFormContainer(Widget1SingleInputForm);
