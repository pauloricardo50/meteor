// @flow
import React from 'react';

import { Calculator } from '../../../../utils/Calculator';
import withTranslationContext from '../../../../components/Translation/withTranslationContext';
import Pdf from '../Pdf/Pdf';
import PropertyPdfPage from '../pages/PropertyPdfPage';
import StructurePdfPage from '../pages/StructurePdfPage';
import LenderRulesPdfPage from '../pages/LenderRulesPdfPage';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankCover from './LoanBankCover';

type LoanBankPDFProps = {
  loan: Object,
  organisation?: Object,
  options?: Object,
  pdfName: String,
};

const getPages = ({ loan, organisation, structureIds, options }) => {
  const { lenderRules } = organisation || {};
  const finalStructureIds = structureIds || loan.structures.map(({ id }) => id);
  const defaultCalculator = new Calculator({ loan, lenderRules });
  return [
    {
      Component: LoanBankCover,
      data: {
        loan,
        options,
        organisation,
        structureIds: finalStructureIds,
        calculator: defaultCalculator,
      },
    },
    ...finalStructureIds.map((structureId, index) => {
      const calculator = new Calculator({ loan, structureId, lenderRules });

      return {
        Component: StructurePdfPage,
        data: { loan, structureId, structureIndex: index, options, calculator },
      };
    }),
    {
      Component: LoanBankBorrowers,
      data: { loan, options, calculator: defaultCalculator },
    },
    { Component: PropertyPdfPage, data: { loan, options } },
    lenderRules
      && lenderRules.length > 0 && {
      Component: LenderRulesPdfPage,
      data: { loan, organisation, options },
    },
  ].filter(x => x);
};

const LoanBankPDF = (props: LoanBankPDFProps) => {
  const { pdfName } = props;
  const pages = getPages(props);
  return <Pdf stylesheet={stylesheet} pages={pages} pdfName={pdfName} />;
};

export default withTranslationContext(() => ({ purchaseType: 'ACQUISITION' }))(LoanBankPDF);
