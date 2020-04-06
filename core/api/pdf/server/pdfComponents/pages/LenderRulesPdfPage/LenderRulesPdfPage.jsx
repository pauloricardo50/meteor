import React from 'react';

import T from '../../../../../../components/Translation';
import { Calculator } from '../../../../../../utils/Calculator';
import PdfPage from '../../PdfPage';
import {
  getCutOffCriteriaRules,
  getExpenseRules,
  getTheoreticalExpenseRules,
} from './lenderRulesArrays';
import LenderRulesPdfTable from './LenderRulesPdfTable';

const LenderRulesPdfPage = ({ pageNb, pageCount, organisation, loan }) => {
  const { lenderRules } = organisation || {};
  const calculator = new Calculator({ loan, lenderRules });
  return (
    <PdfPage
      className="lender-rules-page"
      title={<T id="PDF.title.lenderRules" />}
      withFooter
      pageNb={pageNb}
      pageCount={pageCount}
    >
      <h3>Revenus & Charges</h3>
      <LenderRulesPdfTable rows={getExpenseRules({ loan, calculator })} />

      <h3>Charges théoriques</h3>
      <LenderRulesPdfTable
        rows={getTheoreticalExpenseRules({ loan, calculator })}
      />

      <h3>Critères d'octroi</h3>
      <LenderRulesPdfTable
        rows={getCutOffCriteriaRules({ loan, calculator })}
      />
    </PdfPage>
  );
};

export default LenderRulesPdfPage;
