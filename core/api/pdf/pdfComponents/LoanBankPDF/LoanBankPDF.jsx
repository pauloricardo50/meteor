// @flow
import React from 'react';

import withTranslationContext from 'imports/core/components/Translation/withTranslationContext';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankCover from './LoanBankCover';
import Pdf from '../Pdf/Pdf';
import PropertyPdfPage from '../pages/PropertyPdfPage';
import StructurePdfPage from '../pages/StructurePdfPage';
import { Calculator } from '../../../../utils/Calculator';

type LoanBankPDFProps = {
  loan: Object,
  organisation?: Object,
  options?: Object,
  pdfName: String,
};

const getPages = ({ loan, organisation, structureIds, options }) => {
  const { lenderRules } = organisation || {};
  const finalStructureIds = structureIds || loan.structures.map(({ id }) => id);

  // FIXME: What calculator to pass to the main page?
  return [
    { Component: LoanBankCover, data: { loan, options, organisation } },
    ...finalStructureIds.map((structureId, index) => {
      const calculator = new Calculator({ loan, structureId, lenderRules });

      return {
        Component: StructurePdfPage,
        data: { loan, structureId, structureIndex: index, options, calculator },
      };
    }),
    { Component: LoanBankBorrowers, data: { loan, options } },
    { Component: PropertyPdfPage, data: { loan, options } },
  ];
};

const LoanBankPDF = (props: LoanBankPDFProps) => {
  const { pdfName } = props;
  const pages = getPages(props);
  return <Pdf stylesheet={stylesheet} pages={pages} pdfName={pdfName} />;
};

export default withTranslationContext(() => ({ purchaseType: 'ACQUISITION' }))(LoanBankPDF);
