// @flow
import React from 'react';

import Money from 'core/components/Translation/numberComponents/Money';
import T from '../../../../../../components/Translation';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import PdfPage from '../../PdfPage';
import ProjectBalanceSheet from './ProjectBalanceSheet';
import CostsBalanceSheet from './CostsBalanceSheet';
import IncomeAndExpenses from './IncomeAndExpenses';
import RemainingOwnFundsTable from './RemainingOwnFundsTable';
import SingleStructureRecapTable from './SingleStructureRecapTable';

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
      <SingleStructureRecapTable
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <ProjectBalanceSheet
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <CostsBalanceSheet
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
