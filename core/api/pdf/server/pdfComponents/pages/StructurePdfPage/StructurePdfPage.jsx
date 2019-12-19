// @flow
import React from 'react';

import Money from 'core/components/Translation/numberComponents/Money';
import T from '../../../../../../components/Translation';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import PdfPage from '../../PdfPage';
import BalanceSheet from './BalanceSheet';
import IncomeAndExpenses from './IncomeAndExpenses';
import RemainingOwnFundsTable from './RemainingOwnFundsTable';

type StructurePdfPageProps = {};

const StructurePdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
  calculator,
}: StructurePdfPageProps) => {
  const incomeRatio = calculator.getIncomeRatio({ loan, structureId });
  const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
  const { wantedLoan, name: structureName } = calculator.selectStructure({
    loan,
    structureId,
  });
  return (
    <PdfPage
      className="property-page"
      title={
        <T
          id="PDF.title.structure"
          values={{ name: structureName || structureIndex + 1 }}
        />
      }
      withFooter
      pageNb={pageNb}
      pageCount={pageCount}
    >
      <h3 className="finma-ratio">
        Taux d'avance:&nbsp;
        <span>
          <PercentWithStatus
            value={borrowRatio}
            status={borrowRatio > calculator.maxBorrowRatio ? ERROR : SUCCESS}
          />
        </span>
      </h3>
      <h3 className="wanted-loan">
        Prêt hypothécaire demandé:&nbsp;
        <b>
          <Money value={wantedLoan} />
        </b>
      </h3>

      <BalanceSheet
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <h3 className="finma-ratio">
        Taux d'effort:&nbsp;
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
      <RemainingOwnFundsTable
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />
    </PdfPage>
  );
};

export default StructurePdfPage;
