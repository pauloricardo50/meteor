import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';

const Adder = ({ handleAdd }) => (
  <div>
    <Button
      raised
      onClick={() => handleAdd('upload')}
      label="Ajouter Upload"
      style={{ marginRight: 8 }}
    />
    <Button raised onClick={() => handleAdd('todo')} label="Ajouter Todo" />
  </div>
);

Adder.propTypes = {
  handleAdd: PropTypes.func.isRequired,
};

export default Adder;
