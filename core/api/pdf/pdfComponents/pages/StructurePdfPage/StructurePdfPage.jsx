// @flow
import React from 'react';

import Calculator from '../../../../../utils/Calculator';
import T from '../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import BalanceSheetTable from './BalanceSheetTable';

type StructurePdfPageProps = {};

const StructurePdfPage = ({
  loan,
  structureId,
  structureIndex,
  pageNb,
  pageCount,
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
      <BalanceSheetTable loan={loan} structureId={structureId} />
    </PdfPage>
  );
};

export default StructurePdfPage;
