import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const swissFrancMask = createNumberMask({
  prefix: 'CHF ',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
});

export const percentMask = createNumberMask({
  prefix: '',
  suffix: '%',
  allowDecimal: true,
  // requireDecimal: true,
  decimalSymbol: '.',
  allowLeadingZeroes: true,
});

export const decimalMask = createNumberMask({
  prefix: '',
  allowDecimal: true,
  decimalLimit: 3,
  decimalSymbol: '.',
  requireDecimal: false,
  allowLeadingZeroes: true,
});
