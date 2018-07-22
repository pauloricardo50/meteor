import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { CLOSING_STEPS_TYPE } from 'core/api/constants';

const Adder = ({ handleAdd }) => (
  <React.Fragment>
    <Button
      raised
      onClick={() => handleAdd(CLOSING_STEPS_TYPE.UPLOAD)}
      label="Ajouter Upload"
      style={{ marginRight: 8 }}
    />
    <Button
      raised
      onClick={() => handleAdd(CLOSING_STEPS_TYPE.TODO)}
      label="Ajouter Todo"
    />
  </React.Fragment>
);

Adder.propTypes = {
  handleAdd: PropTypes.func.isRequired,
};

export default Adder;
