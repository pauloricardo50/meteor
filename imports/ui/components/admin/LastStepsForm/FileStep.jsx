import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import TextInput from '/imports/ui/components/general/TextInput';

const FileStep = ({ step, handleChange, handleRemove }) => (
  <div className="mask1 flex-col" style={{ marginBottom: 16, width: '100%' }}>
    <h3>
      Document à uploader <small className="disabled">{step.id}</small>
    </h3>
    <TextInput
      label="Nom du document"
      id="title"
      handleChange={(key, value) => handleChange(step.id, key, value)}
    />
    <Button
      onClick={() => handleRemove(step.id)}
      label="Supprimer"
      style={{ marginTop: 8 }}
    />
  </div>
);

FileStep.propTypes = {};

export default FileStep;
