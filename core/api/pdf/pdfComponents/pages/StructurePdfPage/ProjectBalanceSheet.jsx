import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import Percent from '../../../../../components/Translation/numberComponents/Percent';
import { OWN_FUNDS_TYPES } from '../../../../borrowers/borrowerConstants';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../loans/loanConstants';
import BalanceSheetTable from '../../BalanceSheetTable';
import { shouldRenderRow } from '../../PdfTable/PdfTable';

const getCostLines = ({ loan, structureId, calculator }) => {
  const propertyValue = calculator.selectPropertyValue({ loan, structureId });
  const propertyWork = calculator.selectStructureKey({
    loan,
    structureId,
    key: 'propertyWork',
  });

  return [
    {
      label: (
        <T id="Forms.value" values={{ purchaseType: loan.purchaseType }} />
      ),
      value: propertyValue,
    },
    {
      label: <T id="Forms.propertyWork" />,
      value: propertyWork,
      condition: propertyWork > 0,
    },
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const getFinancingLines = ({ loan, structureId, calculator }) => {
  const wantedLoan = calculator.selectLoanValue({ loan, structureId });
  const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
  const cashRatio = calculator.getCashRatio({ loan, structureId });
  const insurance2Ratio = calculator.getInsurance2WithdrawRatio({
    loan,
    structureId,
  });
  const fees = calculator.getFees({ loan, structureId }).total;
  const cashUsed = calculator.getCashUsed({ loan, structureId }) - fees;
  const insurance2Used = calculator.getUsedFundsOfType({
    loan,
    type: OWN_FUNDS_TYPES.INSURANCE_2,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    structureId,
  });

  return [
    {
      label: (
        <>
          <T id="Forms.variable.wantedLoan" />
          &nbsp;
          <span className="secondary">
            (<Percent value={borrowRatio} />)
          </span>
        </>
      ),
      value: <Money value={wantedLoan} currency={false} />,
      money: false,
    },
    {
      label: (
        <>
          <T id="PDF.StructurePage.cashRatio" />
          &nbsp;
          <span className="secondary">
            (<Percent value={cashRatio} />)
          </span>
        </>
      ),
      value: <Money value={cashUsed} currency={false} />,
      money: false,
    },
    {
      label: (
        <>
          <T id="PDF.StructurePage.insurance2Ratio" />
          &nbsp;
          <span className="secondary">
            (<Percent value={insurance2Ratio} />)
          </span>
        </>
      ),
      value: <Money value={insurance2Used} currency={false} />,
      money: false,
      condition: !!insurance2Used,
    },
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const ProjectBalanceSheet = ({ loan, structureId, calculator }) => (
  <BalanceSheetTable
    titles={[
      <T id="Recap.project" key="project" />,
      <T id="Recap.financing" key="financing" />,
    ]}
    leftRows={getCostLines({ loan, structureId, calculator })}
    rightRows={getFinancingLines({ loan, structureId, calculator })}
    bottomTitles={[
      <T id="Recap.total" key="total1" />,
      <T id="Recap.total" key="total2" />,
    ]}
    bottomValues={[
      <Money
        currency={false}
        value={calculator.getPropAndWork({ loan, structureId })}
        key="0"
      />,
      <Money
        currency={false}
        value={
          calculator.getTotalFinancing({ loan, structureId }) -
          calculator.getFees({ loan, structureId }).total
        }
        key="1"
      />,
    ]}
  />
);

export default ProjectBalanceSheet;
