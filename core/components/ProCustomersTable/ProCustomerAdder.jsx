import React from 'react';

import { AutoFormDialog } from '../AutoForm2';
import Icon from '../Icon';
import T from '../Translation';
import ProCustomerAdderContainer from './ProCustomerAdderContainer';

const ProCustomerAdder = ({ schema, onSubmit }) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit}
    title={<T id="ProCustomerAdder.title" />}
    description={
      <p className="description">
        <T id="ProCustomerAdder.description" />
      </p>
    }
    buttonProps={{
      raised: true,
      secondary: true,
      label: <T id="ProCustomerAdder.title" />,
      icon: <Icon type="personAdd" />,
    }}
  />
);

export default ProCustomerAdderContainer(ProCustomerAdder);
