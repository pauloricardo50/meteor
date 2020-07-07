import React from 'react';
import { View } from '@react-pdf/renderer';

import { Money } from '../../../../components/Translation';
import Calculator from '../../../../utils/Calculator';
import { PURCHASE_TYPE } from '../../../loans/loanConstants';
import T from '../PdfTranslation';
import Text from '../Text';

const getDetails = ({
  purchaseType,
  residenceType,
  propertyValue,
  borrowRatio,
  canton,
}) => {
  if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
    const loanValue = propertyValue * borrowRatio;
    const ownFunds = propertyValue - loanValue;
    const notaryFees = Calculator.getNotaryFees({
      loan: Calculator.createLoanObject({
        residenceType,
        wantedLoan: loanValue,
        propertyValue,
        canton,
        purchaseType,
      }),
    }).total;

    return [
      { id: 'general.mortgageLoan', value: loanValue },
      { id: 'general.ownFunds', value: ownFunds },
      { id: 'general.notaryFees', value: notaryFees, prefix: '~' },
    ];
  }
  if (purchaseType === PURCHASE_TYPE.REFINANCING) {
    return [];
  }
};

const SimpleFinancingCertificateDetails = props => {
  const details = getDetails(props);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      {details.map(({ id, value, prefix }) => (
        <View
          key={id}
          style={{ flexDirection: 'column', alignItems: 'center' }}
        >
          <Text style={{ marginBottom: 8 }}>
            <T id={id} />
          </Text>
          <Text style={{ fontFamily: 'Manrope-semibold' }}>
            {prefix}
            <Money value={value} tag={React.Fragment} />
          </Text>
        </View>
      ))}
    </View>
  );
};
export default SimpleFinancingCertificateDetails;
