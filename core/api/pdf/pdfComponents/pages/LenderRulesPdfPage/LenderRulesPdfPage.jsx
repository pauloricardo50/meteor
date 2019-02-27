// @flow
import React from 'react';

import T from '../../../../../components/Translation';
import { Calculator } from '../../../../../utils/Calculator';
import PdfPage from '../../PdfPage';
import LenderRulesPdfTable from './LenderRulesPdfTable';
import {
  getExpenseRules,
  getTheoreticalExpenseRules,
  getCutOffCriteriaRules,
} from './lenderRulesArrays';

type LenderRulesPdfPageProps = {};

const LenderRulesPdfPage = ({
  pageNb,
  pageCount,
  organisation,
  loan,
}: LenderRulesPdfPageProps) => {
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
      <h2>Revenus & Charges</h2>
      <LenderRulesPdfTable rows={getExpenseRules({ loan, calculator })} />
      {/* <h2>Charges</h2>
      <LenderRulesPdfTable rows={[]} /> */}
      <h2>Charges théoriques</h2>
      <LenderRulesPdfTable
        rows={getTheoreticalExpenseRules({ loan, calculator })}
      />
      <h2>Critères d'octroi</h2>
      <LenderRulesPdfTable
        rows={getCutOffCriteriaRules({ loan, calculator })}
      />
    </PdfPage>
  );
};

export default LenderRulesPdfPage;
