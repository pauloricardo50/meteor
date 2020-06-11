import React from 'react';
import { withProps } from 'recompose';

import CustomSubmitField from 'core/components/AutoForm2/CustomSubmitField';
import Button from 'core/components/Button';
import { CollectionIconLink } from 'core/components/IconLink';
import DialogForm from 'core/components/ModalManager/DialogForm';
import T from 'core/components/Translation';

const UnsuccessfulReasonDialogForm = ({ schema, doc, actions, ...props }) => (
  <DialogForm
    schema={schema}
    description="Entrez la raison du passage du dossier en sans suite"
    className="animated fadeIn"
    important
    actions={actions}
    {...props}
  >
    <div className="flex-row center">
      <p>Vous vous apprêtez à passer le dossier&nbsp;</p>
      <CollectionIconLink relatedDoc={doc} />
      <p>&nbsp;en sans suite.</p>
    </div>
  </DialogForm>
);

export default withProps(() => ({
  actions: ({ closeAll }) => [
    <Button
      primary
      label={<T id="general.cancel" />}
      onClick={closeAll}
      key="cancel"
    />,
    <CustomSubmitField key="submit" />,
  ],
}))(UnsuccessfulReasonDialogForm);
