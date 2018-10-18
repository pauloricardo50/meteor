// @flow
import React from 'react';
import Chip from 'core/components/Material/Chip';
import { withState, compose } from 'recompose';
import { scroller as scroll, Element } from 'react-scroll';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import Table from '../../../Table';
import Button from '../../../Button';
import AdditionalLotModifier from './AdditionalLotModifier';
import StatusLabel from '../../../StatusLabel';
import { PROMOTION_LOTS_COLLECTION } from '../../../../api/constants';

type AdditionalLotsTableProps = {
  promotion: Object,
  showTable: boolean,
  setShowTable: Function,
  additionalLotToModify: Object,
  setAdditionalLotToModify: Function,
  showDialog: boolean,
  setShowDialog: Function,
};

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
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

const makeMapAdditionalLot = ({
  setAdditionalLotToModify,
  setShowDialog,
}) => (lot) => {
  const { _id, name, type, value, description, promotionLots, status } = lot;
  return {
    id: _id,
    columns: [
      name,
      {
        raw: status,
        label: (
          <StatusLabel collection={PROMOTION_LOTS_COLLECTION} status={status} />
        ),
      },
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
    handleClick: () => {
      setAdditionalLotToModify(lot);
      setShowDialog(true);
    },
  };
};

const AdditionalLotsTable = ({
  promotion,
  showTable,
  setShowTable,
  additionalLotToModify,
  setAdditionalLotToModify,
  showDialog,
  setShowDialog,
}: AdditionalLotsTableProps) =>
  (promotion.lots && promotion.lots.length > 0 ? (
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
      <Element name="additional-lots-table" className="additional-lots-table">
        {showTable && (
          <>
            <h3 className="text-center">
              <T id="PromotionPage.AdditionalLotsTable" />
            </h3>

            <Table
              rows={
                promotion.lots
                && promotion.lots.map(makeMapAdditionalLot({
                  setAdditionalLotToModify,
                  setShowDialog,
                }))
              }
              columnOptions={columnOptions}
            />
            {additionalLotToModify && (
              <AdditionalLotModifier
                lot={additionalLotToModify}
                promotionLots={promotion.promotionLots}
                open={showDialog}
                setOpen={setShowDialog}
              />
            )}
          </>
        )}
      </Element>
    </div>
  ) : null);

export default compose(
  withState('showTable', 'setShowTable', false),
  withState('additionalLotToModify', 'setAdditionalLotToModify', null),
  withState('showDialog', 'setShowDialog', false),
)(AdditionalLotsTable);
