import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import Icon from 'core/components/Icon';
import InterestRatesDialogFormContainer from './InterestRatesDialogFormContainer';

const InsertInterestRatesDialogForm = ({
  schema,
  insertInterestRates,
  fields,
}) => (
  <AutoFormDialog
    emptyDialog
    schema={schema}
    model={{ date: new Date() }}
    onSubmit={insertInterestRates}
    buttonProps={{
      label: 'Taux',
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
      className: 'mt-16',
    }}
    title={<T id="InterestRates.insert" />}
  >
    {() => fields}
  </AutoFormDialog>
);

export default InterestRatesDialogFormContainer(InsertInterestRatesDialogForm);
