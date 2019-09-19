// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm2';
import CustomSubmitField from 'core/components/AutoForm2/CustomSubmitField';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import ZipLoanModalContainer from './ZipLoanModalContainer';

type ZipLoanModalProps = {
  closeModal: Function,
  schema: Object,
  model: Object,
  fields: React.Component,
  onSubmit: Function,
};

const ZipLoanModal = ({
  closeModal,
  schema,
  model,
  fields,
  onSubmit,
}: ZipLoanModalProps) => (
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
