//      
import React from 'react';
import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import InterestRatesDialogFormContainer from './InterestRatesDialogFormContainer';

                                           
                 
                                
                                
                        
                
                    
                                
                      
  

const ModifyInterestRatesDialogForm = ({
  schema,
  modifyInterestRates,
  removeInterestRates,
  fields,
  open,
  setOpen,
  interestRatesToModify,
  submitting,
}                                    ) => (
  <AutoFormDialog
    emptyDialog
    noButton
    schema={schema}
    model={interestRatesToModify}
    onSubmit={modifyInterestRates}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
    renderAdditionalActions={({ disabled, setDisableActions }) => (
      <Button
        label={<T id="InterestRates.remove" />}
        error
        outlined
        onClick={() => {
          setDisableActions(true);
          return removeInterestRates(interestRatesToModify._id).finally(() =>
            setDisableActions(false),
          );
        }}
        disabled={disabled}
      />
    )}
  >
    {() => fields}
  </AutoFormDialog>
);

export default InterestRatesDialogFormContainer(ModifyInterestRatesDialogForm);
