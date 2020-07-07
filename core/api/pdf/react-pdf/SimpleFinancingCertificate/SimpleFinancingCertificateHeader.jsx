import React from 'react';
import moment from 'moment';

import { setupMoment } from '../../../../utils/localization/localizationHelpers';
import T from '../PdfTranslation';
import Text from '../Text';

const SimpleFinancingCertificateHeader = ({ name }) => {
  setupMoment();
  // Adding the new Date() inside the moment initializer, fixes a timezone issue
  // Without it, the date is UTC
  const now = moment(new Date()).format('D MMMM YYYY, à HH:mm');
  return (
    <>
      <Text
        style={{ position: 'absolute', top: '15mm', left: '25mm' }}
        size={10}
      >
        {now}
      </Text>
      <Text
        style={{ position: 'absolute', top: '15mm', right: '25mm' }}
        size={10}
      >
        <T id="SimpleFinancingCertificate.loanName" values={{ name }} />
      </Text>
    </>
  );
};

export default SimpleFinancingCertificateHeader;
