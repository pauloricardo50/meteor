// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import ProCustomerAdderContainer from './ProCustomerAdderContainer';
import T from '../Translation';
import Icon from '../Icon';

type ProCustomerAdderProps = {};

const ProCustomerAdder = ({ schema, onSubmit }: ProCustomerAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit}
    title={<T id="ProCustomerAdder.title" />}
    description={(
      <p className="description">
        <T id="ProCustomerAdder.description" />
      </p>
    )}
    buttonProps={{
      raised: true,
      secondary: true,
      label: <T id="ProCustomerAdder.title" />,
      icon: <Icon type="personAdd" />,
    }}
  />
);

export default ProCustomerAdderContainer(ProCustomerAdder);
