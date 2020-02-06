import React from 'react';

import AutoForm from 'core/components/AutoForm2';
import CustomSubmitField from 'core/components/AutoForm2/CustomSubmitField';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import ZipLoanModalContainer from './ZipLoanModalContainer';

const ZipLoanModal = ({ closeModal, schema, model, fields, onSubmit }) => (
  <AutoForm schema={schema} model={model} onSubmit={onSubmit}>
    <>
      {fields}
      <div className="zip-loan-modal-actions">
        <Button
          onClick={() => closeModal()}
          label={<T id="general.close" />}
          raised
          primary
        />
        <CustomSubmitField />
      </div>
    </>
  </AutoForm>
);

export default ZipLoanModalContainer(ZipLoanModal);
