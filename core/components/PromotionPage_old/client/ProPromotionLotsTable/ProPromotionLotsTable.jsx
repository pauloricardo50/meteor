// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import Table from '../../../Table';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';
import { LOT_TYPES, PROPERTY_TYPE } from '../../../../api/constants';
import { moneyField } from '../../../../api/helpers/sharedSchemas';

type ProPromotionLotsTableProps = {};

export const promotionLotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true, placeholder: 'A' } },
  value: { ...moneyField, defaultValue: 0 },
  landValue: { ...moneyField, defaultValue: 0 },
  constructionValue: { ...moneyField, defaultValue: 0 },
  additionalMargin: { ...moneyField, defaultValue: 0 },
  propertyType: {
    type: String,
    allowedValues: Object.values(PROPERTY_TYPE),
    uniforms: { placeholder: null },
  },
  insideArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  terraceArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  gardenArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  roomCount: { type: Number, optional: true, min: 0, max: 100 },
  bathroomCount: { type: Number, optional: true, min: 0, max: 100 },
  yearlyExpenses: moneyField,
  description: {
    type: String,
    optional: true,
    uniforms: { placeholder: 'Attique avec la meilleure vue du bâtiment' },
  },
});

export const lotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true, placeholder: '1' } },
  type: {
    type: String,
    allowedValues: Object.values(LOT_TYPES),
    uniforms: { displayEmpty: false },
  },
  description: {
    type: String,
    optional: true,
    uniforms: { placeholder: 'Parking en enfilade' },
  },
  value: { ...moneyField, min: 0 },
});

const ProPromotionLotsTable = ({
  rows,
  columnOptions,
  addProperty,
  addLot,
  canAddLots,
}: ProPromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    {canAddLots && (
      <div className="promotion-table-actions">
        <AutoFormDialog
          title={<T id="PromotionPage.addProperty" />}
          description={<T id="PromotionPage.promotionLotValueDescription" />}
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
          title={<T id="PromotionPage.addLot" />}
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
    <Table
      rows={rows}
      columnOptions={columnOptions}
      className="pro-promotion-lots-table"
    />
  </>
);

export default ProPromotionLotsTableContainer(ProPromotionLotsTable);
