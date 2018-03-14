import { connect } from 'react-redux';
import { NOTARY_FEES } from 'core/config/financeConstants';
import { toMoney } from 'core/utils/conversionFunctions';

export default connect(({
  widget1: {
    property: { value: propertyValue },
    fortune: { value: fortune },
  },
}) => {
  const showValues = propertyValue && fortune;
  const array = [
    {
      label: 'Recap.project',
      title: true,
    },
    {
      label: 'Recap.purchasePrice',
      value: propertyValue,
    },
    {
      label: 'general.notaryFees',
      value: propertyValue * NOTARY_FEES,
    },
    {
      label: 'Recap.totalCost',
      value: propertyValue * (1 + NOTARY_FEES),
      spacing: true,
      bold: true,
    },
    {
      label: 'Recap.financing',
      title: true,
    },
    {
      label: 'general.ownFunds',
      value: fortune,
    },
    {
      label: 'general.mortgageLoan',
      value: fortune,
    },
    {
      label: 'Recap.totalFinancing',
      value: propertyValue * (1 + NOTARY_FEES),
      bold: true,
    },
  ].map(item => ({ ...item, value: showValues ? toMoney(item.value) : '-' }));

  return { array };
});
