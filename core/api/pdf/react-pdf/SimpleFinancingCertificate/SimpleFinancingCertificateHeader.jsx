import React from 'react';
import moment from 'moment';

import { setupMoment } from '../../../../utils/localization/localizationHelpers';
import T from '../PdfTranslation';
import Text from '../Text';

const SimpleFinancingCertificateHeader = ({ name }) => {
  setupMoment();

  return (
    <>
      <Text
        style={{ position: 'absolute', top: '15mm', left: '25mm' }}
        size={10}
      >
        {moment().format('D MMMM YYYY, à HH:mm')}
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
