import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AutoForm from '../AutoForm2';
import { CustomAutoField } from '../AutoForm2/AutoFormComponents';
import AutoFormLayout from '../AutoForm2/AutoFormLayout';
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
  layout,
  actions,
  ...props
}) => (
  <>
    {title && <DialogTitle>{title}</DialogTitle>}
    <AutoForm
      model={model}
      schema={schema}
      onSubmit={makeOnSubmit(onSubmit, closeModal)}
      {...props}
    >
      <DialogContent>
        {children}
        {description && <DialogContentText>{description}</DialogContentText>}
        {layout ? (
          <AutoFormLayout
            AutoField={CustomAutoField}
            layout={layout}
            schemaKeys={schema._schemaKeys}
          />
        ) : (
          <CustomAutoFields autoField={CustomAutoField} />
        )}
      </DialogContent>
      <DialogActions>
        {actions ? (
          actions({ closeAll })
        ) : (
          <>
            <Button
              primary
              label={<T id="general.close" />}
              onClick={closeAll}
            />
            <CustomSubmitField />
          </>
        )}
      </DialogActions>
    </AutoForm>
  </>
);

export default DialogForm;
