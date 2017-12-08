import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import TextInput from '/imports/ui/components/general/TextInput';

const TodoStep = ({ step, onChange, handleRemove }) => (
  <div className="mask1 flex-col" style={{ marginBottom: 16, width: '100%' }}>
    <h3>
      Todo à faire <small className="disabled">{step.id}</small>
    </h3>
    <TextInput
      label="Titre"
      id="title"
      onChange={(key, value) => onChange(step.id, key, value)}
      value={step.title}
    />
    <TextInput
      label="Description"
      id="description"
      onChange={(key, value) => onChange(step.id, key, value)}
      value={step.description}
      fullWidth
      multiline
      rows={2}
    />
    <Button
      onClick={() => handleRemove(step.id)}
      label="Supprimer"
      style={{ marginTop: 8 }}
    />
  </div>
);

TodoStep.propTypes = {
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default TodoStep;
