import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AutoForm from '../AutoForm2';
import { CustomAutoField } from '../AutoForm2/AutoFormComponents';
import CustomAutoFields from '../AutoForm2/CustomAutoFields';
import CustomSubmitField from '../AutoForm2/CustomSubmitField';
import Button from '../Button';
import T from '../Translation';

const makeOnSubmit = (onSubmit, closeModal) => {
  if (onSubmit) {
    return (...args) => onSubmit(...args).then(closeModal);
  }

  return closeModal;
};

const DialogForm = ({
  closeModal,
  closeAll,
  title,
  model,
  schema,
  description,
  onSubmit,
  children,
}) => (
  <>
    {title && <DialogTitle>{title}</DialogTitle>}
    <AutoForm
      model={model}
      schema={schema}
      onSubmit={makeOnSubmit(onSubmit, closeModal)}
    >
      <DialogContent>
        {children}
        {description && <DialogContentText>{description}</DialogContentText>}
        <CustomAutoFields autoField={CustomAutoField} />
      </DialogContent>
      <DialogActions>
        <Button primary label={<T id="general.close" />} onClick={closeAll} />
        <CustomSubmitField />
      </DialogActions>
    </AutoForm>
  </>
);

export default DialogForm;
