// @flow
import { connect } from 'react-redux';

const FinancingStructuresDataContainer = ({
  asArrays = false,
}: { asArrays: boolean } = {}) => connect(({ financingStructures }) => {
  if (asArrays) {
    return {
      ...financingStructures,
      structures: Object.values(financingStructures.structures),
      borrowers: Object.values(financingStructures.borrowers),
      properties: Object.values(financingStructures.properties),
    };
  }
  return financingStructures;
});

export default FinancingStructuresDataContainer;
