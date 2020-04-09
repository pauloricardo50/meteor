import React from 'react';

import withTranslationContext from '../../../../../components/Translation/withTranslationContext';
import { Calculator } from '../../../../../utils/Calculator';
import BorrowersPdfPage from '../pages/BorrowersPdfPage';
import LenderRulesPdfPage from '../pages/LenderRulesPdfPage';
import PropertyPdfPage from '../pages/PropertyPdfPage';
import StructureAppendixPdfPage from '../pages/StructureAppendixPdfPage/StructureAppendixPdfPage';
import StructurePdfPage from '../pages/StructurePdfPage';
import Pdf from '../Pdf/Pdf';
import LoanBankCover from './LoanBankCover';
import stylesheet from './stylesheet';

const getPages = ({
  loan,
  organisation,
  structureIds,
  backgroundInfo,
  options,
}) => {
  const { lenderRules } = organisation || {};
  const finalStructureIds = structureIds || loan.structures.map(({ id }) => id);
  const defaultCalculator = new Calculator({ loan, lenderRules });
  return [
    {
      id: 'cover',
      Component: LoanBankCover,
      data: {
        loan,
        options,
        organisation,
        structureIds: finalStructureIds,
        calculator: defaultCalculator,
        backgroundInfo,
      },
    },
    ...finalStructureIds
      .map((structureId, index) => {
        const calculator = new Calculator({ loan, structureId, lenderRules });

        return [
          {
            id: structureId,
            Component: StructurePdfPage,
            data: {
              loan,
              structureId,
              structureIndex: index,
              options,
              calculator,
            },
          },
          {
            id: `${structureId}-appendix`,
            Component: StructureAppendixPdfPage,
            data: {
              loan,
              structureId,
              structureIndex: index,
              options,
              calculator,
            },
          },
        ];
      })
      .reduce((pages, page) => [...pages, ...page], []),
    {
      id: 'borrowers',
      Component: BorrowersPdfPage,
      data: { loan, options, calculator: defaultCalculator },
    },
    { id: 'property', Component: PropertyPdfPage, data: { loan, options } },
    lenderRules &&
      lenderRules.length > 0 && {
        id: 'lenderRules',
        Component: LenderRulesPdfPage,
        data: { loan, organisation, options },
      },
  ].filter(x => x);
};

const LoanBankPDF = props => {
  const { pdfName } = props;
  const pages = getPages(props);
  return <Pdf stylesheet={stylesheet} pages={pages} pdfName={pdfName} />;
};

export default withTranslationContext(() => ({ purchaseType: 'ACQUISITION' }))(
  LoanBankPDF,
);
