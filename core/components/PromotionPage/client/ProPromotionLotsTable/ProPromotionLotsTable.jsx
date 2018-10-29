// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { PropertySchema } from '../../../../api/properties/properties';
import LotSchema from '../../../../api/lots/schemas/LotSchema';
import Table from '../../../Table';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';

type ProPromotionLotsTableProps = {};

const promotionLotSchema = new SimpleSchema({
  name: { type: String },
  value: { type: Number },
});

const ProPromotionLotsTable = ({
  rows,
  columnOptions,
  addProperty,
  addLot,
  canModify,
}: ProPromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    {canModify && (
      <div className="promotion-table-actions">
        <AutoFormDialog
          buttonProps={{
            label: <T id="PromotionPage.addProperty" />,
            raised: true,
            primary: true,
            style: { alignSelf: 'flex-start' },
          }}
          schema={promotionLotSchema}
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
    )}
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProPromotionLotsTableContainer(ProPromotionLotsTable);
