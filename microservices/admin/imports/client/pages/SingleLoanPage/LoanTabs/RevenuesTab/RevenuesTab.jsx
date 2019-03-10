import React from 'react';

import Table from 'core/components/Table';
import RevenuesTabContainer from './RevenuesTabContainer';
import RevenueAdder from './RevenueAdder';
import RevenueModifier from './RevenueModifier';

const RevenuesTab = (props) => {
  const {
    rows,
    columnOptions,
    loan,
    revenueToModify,
    setOpenModifier,
    openModifier,
  } = props;

  return (
    <div className="revenues-tab">
      <h2>Revenus</h2>
      <RevenueAdder loan={loan} />
      <RevenueModifier
        loan={loan}
        revenue={revenueToModify}
        open={openModifier}
        setOpen={setOpenModifier}
      />
      <Table rows={rows} columnOptions={columnOptions} />
    </div>
  );
};

export default RevenuesTabContainer(RevenuesTab);
