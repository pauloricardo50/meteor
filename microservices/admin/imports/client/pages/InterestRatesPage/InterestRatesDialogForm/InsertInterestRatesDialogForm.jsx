//      
import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'imports/core/components/Translation/';
import InterestRatesDialogFormContainer from './InterestRatesDialogFormContainer';

                                           
                 
                                
                        
  

const InsertInterestRatesDialogForm = ({
  schema,
  insertInterestRates,
  fields,
}                                    ) => (
  <AutoFormDialog
    emptyDialog
    schema={schema}
    model={{ date: new Date() }}
    onSubmit={insertInterestRates}
    buttonProps={{
      label: <T id="InterestRates.insert" />,
      raised: true,
      primary: true,
    }}
    title={<T id="InterestRates.insert" />}
  >
    {() => fields}
  </AutoFormDialog>
);

export default InterestRatesDialogFormContainer(InsertInterestRatesDialogForm);
