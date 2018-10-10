// @flow
import React from 'react';

import { PropertySchema } from '../../../api/properties/properties';
import Table from '../../Table';
import T from '../../Translation';
import { AutoFormDialog } from '../../AutoForm2';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';

type ProPromotionLotsTableProps = {};

const ProPromotionLotsTable = ({
  rows,
  columnOptions,
  addProperty,
}: ProPromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    <AutoFormDialog
      buttonProps={{
        label: <T id="PromotionPage.addProperty" />,
        raised: true,
        primary: true,
        style: { alignSelf: 'flex-start' },
      }}
      schema={PropertySchema.pick('name', 'value')}
      onSubmit={addProperty}
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProPromotionLotsTableContainer(ProPromotionLotsTable);
