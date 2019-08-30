// @flow
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import AutoForm from '../AutoForm2';
import { CustomAutoField } from '../AutoForm2/AutoFormComponents';
import CustomAutoFields from '../AutoForm2/CustomAutoFields';
import CustomSubmitField from '../AutoForm2/CustomSubmitField';
import Button from '../Button';
import T from '../Translation';

type DialogFormProps = {
  closeModal: Function,
  closeAll: Function,
  title: String,
  model: Object,
  schema: Object,
  description: String,
  onSubmit?: Function,
};

const DialogForm = ({
  closeModal,
  closeAll,
  title,
  model,
  schema,
  description,
  onSubmit = () => undefined,
  children,
}: DialogFormProps) => (
  <>
    {title && <DialogTitle>{title}</DialogTitle>}
    <AutoForm
      model={model}
      schema={schema}
      onSubmit={onSubmit(closeModal) || closeModal}
    >
      <DialogContent>
        {children}
        {description && <DialogContentText>{description}</DialogContentText>}
        <CustomAutoFields autoField={CustomAutoField} />
      </DialogContent>
      <DialogActions>
        <Button
          primary
          label={<T id="general.close" />}
          onClick={() => {
            closeAll();
          }}
          key="close"
        />
        <CustomSubmitField />
      </DialogActions>
    </AutoForm>
  </>
);

export default DialogForm;
