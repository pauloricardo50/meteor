// @flow
import React from 'react';

import withTranslationContext from 'imports/core/components/Translation/withTranslationContext';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankProject from './LoanBankProject';
import LoanBankCover from './LoanBankCover';
import Pdf from '../Pdf/Pdf';
import PropertyPdfPage from '../pages/PropertyPdfPage';
import StructurePdfPage from '../pages/StructurePdfPage';
import { Calculator } from '../../../../utils/Calculator';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
  pdfName: String,
};

const pages = ({ loan, organisation = {}, options }) => {
  const { lenderRules } = organisation;
  const structureIds = options.structureIds || loan.structures.map(({ id }) => id);

  // FIXME: What calculator to pass to the main page?
  return [
    { Component: LoanBankCover, data: { loan, options } },
    ...structureIds.map((structureId, index) => {
      const calculator = new Calculator({ loan, structureId, lenderRules });

      return {
        Component: StructurePdfPage,
        data: { loan, structureId, structureIndex: index, options, calculator },
      };
    }),
    { Component: LoanBankProject, data: { loan, options } },
    { Component: LoanBankBorrowers, data: { loan, options } },
    { Component: PropertyPdfPage, data: { loan, options } },
  ];
};

const LoanBankPDF = ({ loan, options, pdfName }: LoanBankPDFProps) => (
  <Pdf
    stylesheet={stylesheet}
    pages={pages({ loan, options })}
    pdfName={pdfName}
  />
);

export default withTranslationContext(() => ({ purchaseType: 'ACQUISITION' }))(LoanBankPDF);
