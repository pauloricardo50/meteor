export const getFormats = () => ({
  number: {
    money: {
      style: 'currency',
      currency: 'CHF',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
    moneyWithoutCurrency: {
      style: 'decimal',
      useGrouping: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
    percentage: {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percentageRounded: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
});
