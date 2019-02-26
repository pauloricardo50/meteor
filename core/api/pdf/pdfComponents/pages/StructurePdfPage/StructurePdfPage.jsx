// @flow
import React from 'react';

import T, { Percent } from '../../../../../components/Translation';
import PercentWithStatus from '../../../../../components/PercentWithStatus';
import PdfPage from '../../PdfPage';
import BalanceSheet from './BalanceSheet';
import IncomeAndExpenses from './IncomeAndExpenses';
import { ERROR, SUCCESS } from '../../../../constants';

type StructurePdfPageProps = {};

const StructurePdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
  calculator,
}: StructurePdfPageProps) => {
  const structureName = calculator.selectStructure({ loan, structureId }).name;
  const incomeRatio = calculator.getIncomeRatio({ loan, structureId });
  const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
  return (
    <PdfPage
      className="property-page"
      title={(
        <T
          id="PDF.title.structure"
          values={{ name: structureName || structureIndex + 1 }}
        />
      )}
      withFooter
      pageNb={pageNb}
      pageCount={pageCount}
    >
      <h3 className="finma-ratio">
        Taux d'avance:{' '}
        <span>
          <PercentWithStatus
            value={borrowRatio}
            status={incomeRatio > calculator.maxBorrowRatio ? ERROR : SUCCESS}
          />
        </span>
      </h3>

      <BalanceSheet
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <h3 className="finma-ratio">
        Taux d'effort:{' '}
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
    </PdfPage>
  );
};

export default StructurePdfPage;
