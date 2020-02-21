import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const numberMask = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
};

export const swissFrancMask = createNumberMask(numberMask);

export const swissFrancMaskDecimal = createNumberMask({
  ...numberMask,
  allowDecimal: true,
  requireDecimal: true,
});

export const swissFrancDecimalNegativeMask = createNumberMask({
  ...numberMask,
  allowNegative: true,
  allowDecimal: true,
  requireDecimal: true,
});

export const swissFrancNegativeMask = createNumberMask({
  ...numberMask,
  allowNegative: true,
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
