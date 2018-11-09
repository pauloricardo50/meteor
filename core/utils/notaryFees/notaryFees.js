import NotaryFeesCalculator from './NotaryFeesCalculator';

const notaryFees = ({ loan }) => {
  const calculator = new NotaryFeesCalculator({ canton: 'GE' });
  return calculator.getNotaryFeesForLoan(loan);
};

export default notaryFees;
