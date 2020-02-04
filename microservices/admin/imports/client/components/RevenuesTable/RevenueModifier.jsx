//      
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button/Button';
import RevenueDialogFormContainer from './RevenueDialogFormContainer';

                             
                 
                
                          
  

const RevenueModifier = ({
  schema,
  modifyRevenue,
  model,
  open,
  setOpen,
  submitting,
  deleteRevenue,
  layout,
  description,
}                      ) => (
  <AutoFormDialog
    noButton
    schema={schema}
    model={model}
    onSubmit={modifyRevenue}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    renderAdditionalActions={({ closeDialog, setDisableActions, disabled }) => (
      <Button
        onClick={() =>
          deleteRevenue({
            revenueId: model._id,
            closeDialog,
            setDisableActions,
          }).then(closeDialog)
        }
        error
        disabled={submitting || disabled}
      >
        Supprimer
      </Button>
    )}
    title="Modifier un revenu"
    layout={layout}
    description={description}
  />
);

export default RevenueDialogFormContainer(RevenueModifier);
