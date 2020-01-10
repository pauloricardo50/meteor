// @flow
import React from 'react';

import Percent from 'core/components/Translation/numberComponents/Percent';
import T, { Money } from '../../../../../../components/Translation';
import { shouldRenderRow } from '../../PdfTable/PdfTable';
import BalanceSheetTable from '../../BalanceSheetTable';

type ProjectBalanceSheetTableProps = {};

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
      label: 'Travaux de plus-value',
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
  const insurance2Used = calculator.getInsurance2Used({ loan, structureId });

  return [
    {
      label: (
        <>
          Prêt hypothécaire&nbsp;
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
          Fonds propres épargne&nbsp;
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
          Fonds propres prévoyance professionnelle&nbsp;
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

const ProjectBalanceSheet = ({
  loan,
  structureId,
  calculator,
}: ProjectBalanceSheetTableProps) => (
  <BalanceSheetTable
    titles={['Projet', 'Financement']}
    leftRows={getCostLines({ loan, structureId, calculator })}
    rightRows={getFinancingLines({ loan, structureId, calculator })}
    bottomTitles={['Total', 'Total']}
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
