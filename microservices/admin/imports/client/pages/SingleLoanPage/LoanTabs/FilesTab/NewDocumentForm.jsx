import React from 'react';
import PropTypes from 'prop-types';

import TextInput from 'core/components/TextInput';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import NewDocumentFormContainer from './NewDocumentFormContainer';

const NewDocumentForm = ({ value, onChange, addDocument }) => (
  <div className="new-document-form">
    <TextInput
      value={value}
      onChange={(_, v) => onChange(v)}
      label={<T id="NewDocumentForm.label" />}
      placeholder={<T id="NewDocumentForm.placeholder" />}
    />
    <Button onClick={addDocument} variant="raised" disabled={!value}>
      <T id="NewDocumentForm.cta" />
    </Button>
  </div>
);

NewDocumentForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  addDocument: PropTypes.func.isRequired,
};

export default NewDocumentFormContainer(NewDocumentForm);
