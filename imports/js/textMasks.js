import createNumberMask from 'text-mask-addons/dist/createNumberMask.js'

export const swissFrancMask = createNumberMask({
  prefix: 'CHF ',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '\'',
});
