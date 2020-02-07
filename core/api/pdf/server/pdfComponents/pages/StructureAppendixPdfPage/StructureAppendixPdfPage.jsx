import React from 'react';

import { toMoney } from 'core/utils/conversionFunctions';
import T, { Percent } from '../../../../../../components/Translation';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import PdfPage from '../../PdfPage';
import IncomeAndExpenses from './IncomeAndExpenses';
import RemainingOwnFundsTable from './RemainingOwnFundsTable';

const StructureAppendixPdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
  calculator,
}) => {
  const { name: structureName } = calculator.selectStructure({
    loan,
    structureId,
  });
  const pageName = `${structureName || structureIndex + 1}`;

  const totalExpenses =
    calculator.getTheoreticalMonthly({ loan, structureId }) * 12;
  const totalIncome = calculator.getTotalIncome({ loan, structureId });
  const incomeRatio = calculator.getIncomeRatio({ loan, structureId });

  return (
    <PdfPage
      className="property-page"
      title={<T id="PDF.title.structureAppendix" values={{ name: pageName }} />}
      withFooter
      pageNb={pageNb}
      pageCount={pageCount}
    >
      <RemainingOwnFundsTable
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <h3 className="finma-ratio">
        Taux d'effort*&nbsp;
        <span>
          <PercentWithStatus
            value={incomeRatio}
            status={incomeRatio > calculator.maxIncomeRatio ? ERROR : SUCCESS}
          />
        </span>
      </h3>

      <IncomeAndExpenses
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <i>
        * Le taux d'effort se calcule en divisant les charges par les
        revenus:&nbsp;{toMoney(Math.round(totalExpenses))} /{' '}
        {toMoney(Math.round(totalIncome))} = <Percent value={incomeRatio} />
      </i>
    </PdfPage>
  );
};

export default StructureAppendixPdfPage;
