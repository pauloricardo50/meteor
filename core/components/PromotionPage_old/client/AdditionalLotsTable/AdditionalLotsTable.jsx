// @flow
import React from 'react';
import { Element } from 'react-scroll';
import T from '../../../Translation';
import Table from '../../../Table';
import Button from '../../../Button';
import AdditionalLotModifier from './AdditionalLotModifier';
import AdditionalLotsTableContainer from './AdditionalLotsTableContainer';

type AdditionalLotsTableProps = {
  promotion: Object,
  showTable: boolean,
  additionalLotToModify: Object,
  handleClick: Function,
  showDialog: boolean,
  setShowDialog: Function,
  rows: Array,
  columnOptions: Array,
};

const AdditionalLotsTable = ({
  promotion,
  showTable,
  additionalLotToModify,
  showDialog,
  setShowDialog,
  columnOptions,
  rows,
  handleClick,
  canRemoveLots
}: AdditionalLotsTableProps) =>
  (promotion.lots && promotion.lots.length > 0 ? (
    <div className="additional-lots">
      <Button onClick={handleClick} primary className="additional-lots-button">
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

            <Table rows={rows} columnOptions={columnOptions} />
            {additionalLotToModify && (
              <AdditionalLotModifier
                lot={additionalLotToModify}
                promotionLots={promotion.promotionLots}
                open={showDialog}
                setOpen={setShowDialog}
                canRemoveLots={canRemoveLots}
              />
            )}
          </>
        )}
      </Element>
    </div>
  ) : null);

export default AdditionalLotsTableContainer(AdditionalLotsTable);
