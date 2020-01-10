// @flow
import React from 'react';

import T from '../../../../../../components/Translation';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import PdfPage from '../../PdfPage';
import IncomeAndExpenses from './IncomeAndExpenses';
import RemainingOwnFundsTable from './RemainingOwnFundsTable';

type StructureAppendixPdfPageProps = {};

const StructureAppendixPdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
  calculator,
}: StructureAppendixPdfPageProps) => {
  const incomeRatio = calculator.getIncomeRatio({ loan, structureId });
  const { name: structureName } = calculator.selectStructure({
    loan,
    structureId,
  });
  const pageName = `${structureName || structureIndex + 1}`;
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
        Taux d'effort*:&nbsp;
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

export default StructureAppendixPdfPage;
