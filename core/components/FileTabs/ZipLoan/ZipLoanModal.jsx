import React from 'react';

import AutoForm from '../../AutoForm2';
import CustomSubmitField from '../../AutoForm2/CustomSubmitField';
import Button from '../../Button';
import T from '../../Translation';
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
