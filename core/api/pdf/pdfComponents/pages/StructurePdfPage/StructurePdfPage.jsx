// @flow
import React from 'react';

import Calculator from '../../../../../utils/Calculator';
import T from '../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import BalanceSheet from './BalanceSheet';
import IncomeAndExpenses from './IncomeAndExpenses';

type StructurePdfPageProps = {};

const StructurePdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
  calculator,
}: StructurePdfPageProps) => {
  const structureName = Calculator.selectStructure({ loan, structureId }).name;
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
      <BalanceSheet
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />
      <IncomeAndExpenses
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />
    </PdfPage>
  );
};

export default StructurePdfPage;
