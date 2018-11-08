// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import Table from '../../../Table';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';
import { LOT_TYPES } from '../../../../api/constants';

type ProPromotionLotsTableProps = {};

export const promotionLotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true } },
  value: {
    type: Number,
    defaultValue: 0,
    min: 0,
  },
  insideArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  terraceArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  gardenArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  roomCount: { type: Number, optional: true, min: 0, max: 100 },
  bathroomCount: { type: Number, optional: true, min: 0, max: 100 },
  description: { type: String, optional: true },
});

export const lotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true } },
  type: { type: String, allowedValues: Object.values(LOT_TYPES) },
  description: { type: String, optional: true },
  value: {
    type: Number,
    defaultValue: 0,
    min: 0,
  },
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
          schema={lotSchema}
          onSubmit={addLot}
        />
      </div>
    )}
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProPromotionLotsTableContainer(ProPromotionLotsTable);
