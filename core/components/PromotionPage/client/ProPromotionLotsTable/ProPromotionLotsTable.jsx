// @flow
import React from 'react';

import { PropertySchema } from '../../../../api/properties/properties';
import LotSchema from '../../../../api/lots/schemas/LotSchema';
import Table from '../../../Table';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';

type ProPromotionLotsTableProps = {};

const ProPromotionLotsTable = ({
  rows,
  columnOptions,
  addProperty,
  addLot,
}: ProPromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    <div className="promotion-table-actions">
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
      <AutoFormDialog
        buttonProps={{
          label: <T id="PromotionPage.addLot" />,
          raised: true,
          primary: true,
          style: { alignSelf: 'flex-start' },
        }}
        schema={LotSchema.pick('name', 'type', 'description', 'value')}
        onSubmit={addLot}
      />
    </div>
    <Table rows={rows} columnOptions={columnOptions} clickable={false} />
  </>
);

export default ProPromotionLotsTableContainer(ProPromotionLotsTable);
