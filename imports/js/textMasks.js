import createNumberMask from 'text-mask-addons/dist/createNumberMask.js'

export const swissFrancMask = createNumberMask({
  prefix: 'CHF ',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '\'',
});

export const percentMask = createNumberMask({
  prefix: '',
  suffix: '%',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '\'',
});
