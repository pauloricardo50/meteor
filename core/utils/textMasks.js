import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const swissFrancMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
});

export const swissFrancMaskDecimal = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
  allowDecimal: true,
  requireDecimal: true,
});

export const percentMask = createNumberMask({
  prefix: '',
  suffix: '%',
  allowDecimal: true,
  decimalSymbol: '.',
  allowLeadingZeroes: true,
  allowNegative: true,
});

export const decimalMask = createNumberMask({
  prefix: '',
  allowDecimal: true,
  decimalLimit: 3,
  decimalSymbol: '.',
  requireDecimal: false,
  allowLeadingZeroes: true,
});
