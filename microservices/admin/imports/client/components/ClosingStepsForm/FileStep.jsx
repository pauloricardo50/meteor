import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import TextInput from 'core/components/TextInput';

const FileStep = ({ step, onChange, handleRemove }) => (
  <div
    className="card1 card-top flex-col"
    style={{ marginBottom: 16, width: '100%' }}
  >
    <h3>
      Document à uploader <small className="disabled">{step.id}</small>
    </h3>
    <TextInput
      label="Nom du document"
      id="title"
      onChange={(key, value) => onChange(step.id, key, value)}
      value={step.title}
    />
    <Button
      onClick={() => handleRemove(step.id)}
      label="Supprimer"
      style={{ marginTop: 8 }}
    />
  </div>
);

FileStep.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FileStep;
