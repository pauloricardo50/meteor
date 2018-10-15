// @flow
import React from 'react';
import Chip from 'core/components/Material/Chip';
import { withState } from 'recompose';
import { scroller as scroll, Element } from 'react-scroll';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import Table from '../../../Table';
import Button from '../../../Button';

type AdditionalLotsTableProps = {
  promotion: Object,
  showTable: boolean,
  setShowTable: Function,
};

const columnOptions = [
  { id: 'name' },
  { id: 'type' },
  { id: 'value' },
  { id: 'description' },
  { id: 'allocatedToLot' },
].map(({ id }) => ({
  id,
  label: <T id={`PromotionPage.AdditionalLotsTable.${id}`} />,
}));

const scrollToAdditionalLotsTable = () => {
  scroll.scrollTo('additional-lots-table', {
    smooth: true,
    delay: 100,
    duration: 600,
    offset: -50,
  });
};

const makeMapAdditionalLot = () => ({
  _id,
  name,
  type,
  value,
  description,
  promotionLots,
}) => ({
  id: _id,
  columns: [
    name,
    { raw: type, label: <T id={`Forms.type.${type}`} /> },
    { raw: value, label: toMoney(value) },
    description,
    promotionLots && promotionLots.length > 0 ? (
      promotionLots.map(({ name: promotionLotName, _id: promotionLotId }) => (
        <Chip label={promotionLotName} key={promotionLotId} />
      ))
    ) : (
      <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
    ),
  ],
});

const AdditionalLotsTable = ({
  promotion,
  showTable,
  setShowTable,
}: AdditionalLotsTableProps) =>
  promotion.lots.length > 0 && (
    <div className="additional-lots">
      <Button
        onClick={() => {
          setShowTable(!showTable);
          scrollToAdditionalLotsTable();
        }}
        primary
        className="additional-lots-button"
      >
        {showTable ? (
          <T id="PromotionPage.AdditionalLotsTable.hideTable" />
        ) : (
          <T id="PromotionPage.AdditionalLotsTable.showTable" />
        )}
      </Button>
      <Element
        name="additional-lots-table"
        className="additional-lots-table animated"
      >
        {showTable && (
          <>
            <h3 className="text-center">
              <T id="PromotionPage.AdditionalLotsTable" />
            </h3>
            <Table
              rows={promotion.lots.map(makeMapAdditionalLot())}
              columnOptions={columnOptions}
            />
          </>
        )}
      </Element>
    </div>
  );

export default withState('showTable', 'setShowTable', false)(AdditionalLotsTable);
