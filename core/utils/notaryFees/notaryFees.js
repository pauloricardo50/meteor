import NotaryFeesCalculator from './NotaryFeesCalculator';

const notaryFees = ({ loan, canton = 'GE' }) => {
  const calculator = new NotaryFeesCalculator({ canton });
  return calculator.getNotaryFeesForLoan(loan);
};

export default notaryFees;
