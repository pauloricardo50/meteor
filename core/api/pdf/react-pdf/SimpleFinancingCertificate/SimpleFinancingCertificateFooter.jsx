import React from 'react';
import { View } from '@react-pdf/renderer';

import T from '../PdfTranslation';
import Text from '../Text';

const SimpleFinancingCertificateFooter = ({ canton }) => (
  <View
    style={{
      position: 'absolute',
      flexDirection: 'column',
      bottom: '15mm',
      right: '25mm',
      left: '25mm',
      alignItems: 'center',
    }}
  >
    <Text
      size={8}
      style={{
        textAlign: 'center',
        marginBottom: 32,
        marginRight: 8,
        marginLeft: 8,
        color: '#c3c3c3',
      }}
    >
      <T id="SimpleFinancingCertificate.disclaimer" />
    </Text>
    <Text size={10}>
      <T
        id={
          canton === 'GE'
            ? 'SimpleFinancingCertificate.footerGE'
            : 'SimpleFinancingCertificate.footerVD'
        }
      />
    </Text>
  </View>
);

export default SimpleFinancingCertificateFooter;
