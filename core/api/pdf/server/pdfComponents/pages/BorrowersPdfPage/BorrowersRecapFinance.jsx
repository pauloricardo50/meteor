//      
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import PdfTable from '../../PdfTable';
import { ROW_TYPES } from '../../PdfTable/PdfTable';
import {
  OTHER_INCOME,
  OWN_FUNDS_TYPES,
} from '../../../../../borrowers/borrowerConstants';
import { EXPENSE_TYPES } from '../../../../../lenderRules/lenderRulesConstants';
import {
  getBorrowersInfos,
  makeTableMoneyLine,
  getFormattedMoneyArray,
  addTableEmptyLine,
  shouldRenderArray,
} from './borrowersRecapHelpers';

                                     

const renderExpenses = (expenses, addTableMoneyLine) =>
  Object.values(EXPENSE_TYPES).map(expense => {
    const value = expenses[expense];
    return addTableMoneyLine({
      label: <T id={`PDF.borrowersInfos.expenses.${expense}`} />,
      field: value,
      negative: true,
    });
  });

const getBorrowersFinanceArray = ({ borrowers, calculator }) => {
  const multipleBorrowers = borrowers.length > 1;
  const addTableMoneyLine = makeTableMoneyLine(multipleBorrowers);
  const borrowersInfos = getBorrowersInfos(borrowers, calculator);
  const {
    salary,
    bonus,
    otherIncome,
    expenses,
    realEstateValue,
    realEstateDebt,
    otherFortune,
    realEstateIncome,
  } = borrowersInfos;

  return [
    {
      label: <T id="PDF.borrowersInfos.category.financialSituation" />,
      type: ROW_TYPES.TITLE,
      data: multipleBorrowers
        ? [null, null, <T id="PDF.borrowersInfos.total" key="total" />]
        : [],
      className: 'borrower-table-title-row',
      colspan: multipleBorrowers ? 1 : 2,
    },
    {
      label: <T id="PDF.borrowersInfos.income" />,
      type: ROW_TYPES.SUBSECTION,
    },
    addTableMoneyLine({
      label: (
        <T
          id={
            calculator.shouldUseNetSalary()
              ? 'PDF.borrowersInfos.netSalary'
              : 'PDF.borrowersInfos.salary'
          }
        />
      ),
      field: salary,
      condition: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.bonus" />,
      field: bonus,
    }),
    ...Object.values(OTHER_INCOME).map(income =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.otherIncome.${income}`} />,
        field: otherIncome[income],
      }),
    ),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateIncome" />,
      field: realEstateIncome,
      condition: shouldRenderArray(realEstateIncome),
    }),
    ...renderExpenses(expenses, addTableMoneyLine),
    {
      label: <T id="PDF.borrowersInfos.totalIncome" />,
      data: getFormattedMoneyArray({
        array: borrowers.map(borrower =>
          calculator.getTotalIncome({ borrowers: borrower }),
        ),
        negative: false,
        twoBorrowers: multipleBorrowers,
      }),
      type: ROW_TYPES.SUM,
    },
    addTableEmptyLine(),
    {
      label: <T id="PDF.borrowersInfos.category.fortune" />,
      type: ROW_TYPES.SUBSECTION,
    },
    ...Object.values(OWN_FUNDS_TYPES).map(ownFund =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.ownFund.${ownFund}`} />,
        field: borrowersInfos[ownFund],
      }),
    ),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateValue" />,
      field: realEstateValue,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateDebt" />,
      field: realEstateDebt,
      condition: shouldRenderArray(realEstateValue),
      negative: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.otherFortune" />,
      field: otherFortune,
    }),
    {
      label: <T id="PDF.borrowersInfos.totalFortune" />,
      data: getFormattedMoneyArray({
        array: borrowers.map(borrower =>
          calculator.getTotalFunds({ borrowers: borrower }),
        ),
        negative: false,
        twoBorrowers: multipleBorrowers,
      }),
      type: ROW_TYPES.SUM,
    },
  ];
};

const BorrowersRecapFinance = ({
  anonymous,
  borrowers,
  calculator,
  twoBorrowers,
}                            ) => (
  <PdfTable
    className={cx('borrowers-recap finance', { twoBorrowers })}
    rows={getBorrowersFinanceArray({ borrowers, anonymous, calculator })}
  />
);

export default BorrowersRecapFinance;
