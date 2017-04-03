import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const swissFrancMask = createNumberMask({
  prefix: 'CHF ',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: "'",
});

export const percentMask = createNumberMask({
  prefix: '',
  suffix: '%',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: "'",
  allowDecimal: true,
  decimalSymbol: ',',
});

export const decimalMask = createNumberMask({
  prefix: '',
  allowDecimal: true,
  decimalLimit: 3,
  requireDecimal: true,
});
