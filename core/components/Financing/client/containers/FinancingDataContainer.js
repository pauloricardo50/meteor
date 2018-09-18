// @flow
import { connect } from 'react-redux';

const FinancingDataContainer = ({
  asArrays = false,
}: { asArrays: boolean } = {}) =>
  connect(({ financing }) => {
    if (asArrays) {
      return {
        ...financing,
        structures: Object.values(financing.structures),
        borrowers: Object.values(financing.borrowers),
        properties: Object.values(financing.properties),
      };
    }
    return financing;
  });

export default FinancingDataContainer;
