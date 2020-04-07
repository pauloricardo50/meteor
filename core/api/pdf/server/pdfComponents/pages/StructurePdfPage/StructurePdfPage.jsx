import React from 'react';

import T from '../../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import CostsBalanceSheet from './CostsBalanceSheet';
import PledgeTable from './PledgeTable';
import ProjectBalanceSheet from './ProjectBalanceSheet';
import SingleStructureRecapTable from './SingleStructureRecapTable';

const StructurePdfPage = ({
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

      <PledgeTable
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />

      <CostsBalanceSheet
        loan={loan}
        structureId={structureId}
        calculator={calculator}
      />
    </PdfPage>
  );
};

export default StructurePdfPage;
