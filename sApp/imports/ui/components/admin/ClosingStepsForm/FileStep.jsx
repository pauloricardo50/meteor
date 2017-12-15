import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import TextInput from '/imports/ui/components/general/TextInput';

const FileStep = ({ step, onChange, handleRemove }) => (
  <div className="mask1 flex-col" style={{ marginBottom: 16, width: '100%' }}>
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
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default FileStep;
