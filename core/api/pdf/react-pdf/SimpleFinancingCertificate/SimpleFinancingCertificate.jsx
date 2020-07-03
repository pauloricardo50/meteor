import React from 'react';
import { Document, Font, Image, Page, StyleSheet } from '@react-pdf/renderer';

import { Money } from '../../../../components/Translation';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';
import T from '../PdfTranslation';
import Text from '../Text';
import SimpleFinancingCertificateDetails from './SimpleFinancingCertificateDetails';
import SimpleFinancingCertificateFooter from './SimpleFinancingCertificateFooter';
import SimpleFinancingCertificateHeader from './SimpleFinancingCertificateHeader';

// Use fixed url once the new font files are deployed
const assetUrl = 'http://localhost:5000';
// const assetUrl = 'https://app.e-potek.ch';

Font.register({
  family: 'Manrope-extralight',
  src: `${assetUrl}/fonts/Manrope-ExtraLight.ttf`,
  fontWeight: 300,
});
Font.register({
  family: 'Manrope-semibold',
  src: `${assetUrl}/fonts/Manrope-SemiBold.ttf`,
  fontWeight: 600,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Manrope-extralight',
    padding: '25mm',
    fontSize: 10,
    alignItems: 'stretch',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

// Create Document Component
const SimpleFinancingCertificate = ({ loan = {} }) => {
  const {
    name,
    borrowers,
    maxPropertyValue: { canton, main, second } = {},
    residenceType,
    purchaseType,
  } = loan;
  let propertyValue;
  let borrowRatio;

  if (residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE) {
    propertyValue = main.max.propertyValue;
    borrowRatio = main.max.borrowRatio;
  }
  if (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE) {
    propertyValue = second.max.propertyValue;
    borrowRatio = second.max.borrowRatio;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <SimpleFinancingCertificateHeader name={name} />

        <Image src={`${assetUrl}/img/epotek-logo.png`} style={styles.logo} />

        <Text size={24} style={{ alignSelf: 'center', marginBottom: 8 }}>
          <T id="SimpleFinancingCertificate.title" />
        </Text>
        <Text
          size={16}
          style={{ alignSelf: 'center', color: '#838383', marginBottom: 40 }}
        >
          <T id="SimpleFinancingCertificate.subtitle" />
        </Text>

        <Text style={{ marginBottom: 32 }}>
          <T
            id={`SimpleFinancingCertificate.${purchaseType}.text`}
            values={{
              name1: (
                <Text style={{ fontFamily: 'Manrope-semibold' }}>
                  {borrowers?.[0]?.name}
                </Text>
              ),
              name2:
                borrowers?.length > 1 ? (
                  <Text style={{ fontFamily: 'Manrope-semibold' }}>
                    {borrowers?.[1]?.name}
                  </Text>
                ) : (
                  false
                ),
            }}
          />
        </Text>

        <Text size={36} style={{ alignSelf: 'center', marginBottom: 8 }}>
          <Money value={propertyValue} tag={React.Fragment} />
        </Text>
        <Text
          size={10}
          style={{ alignSelf: 'center', color: '#b3b3b3', marginBottom: 64 }}
        >
          <T id={`Forms.residenceType.${residenceType}`} />
          {' – '}
          <T id={`Forms.canton.${canton}`} />
        </Text>

        <SimpleFinancingCertificateDetails
          propertyValue={propertyValue}
          borrowRatio={borrowRatio}
          purchaseType={purchaseType}
          residenceType={residenceType}
          canton={canton}
        />

        <SimpleFinancingCertificateFooter canton={canton} />
      </Page>
    </Document>
  );
};
export default SimpleFinancingCertificate;
