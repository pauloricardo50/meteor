import React from 'react';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  View,
} from '@react-pdf/renderer';
import moment from 'moment';

import TDefault, { Money } from '../../../../components/Translation';
import Calculator from '../../../../utils/Calculator';
import { setupMoment } from '../../../../utils/localization/localizationHelpers';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';
import Text from '../Text';

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
  headerLeft: {
    position: 'absolute',
    top: '15mm',
    left: '25mm',
  },
  headerRight: {
    position: 'absolute',
    top: '15mm',
    right: '25mm',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    flexDirection: 'column',
    bottom: '15mm',
    right: '25mm',
    left: '25mm',
    alignItems: 'center',
  },
});

const T = p => <TDefault {...p} noTooltips />;

// Create Document Component
const SimpleFinancingCertificate = ({ loan = {} }) => {
  const {
    name = '20-0001',
    borrowers,
    maxPropertyValue: { canton = 'GE', main, second } = {},
    residenceType,
    purchaseType,
  } = loan;
  setupMoment();
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerLeft} size={10}>
          {moment().format('D MMMM YYYY, à HH:mm')}
        </Text>
        <Text style={styles.headerRight} size={10}>
          <T id="SimpleFinancingCertificate.loanName" values={{ name }} />
        </Text>

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
            id="SimpleFinancingCertificate.text"
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ marginBottom: 8 }}>
              <T id="general.mortgageLoan" />
            </Text>
            <Text style={{ fontFamily: 'Manrope-semibold' }}>
              <Money value={loanValue} tag={React.Fragment} />
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ marginBottom: 8 }}>
              <T id="general.ownFunds" />
            </Text>
            <Text style={{ fontFamily: 'Manrope-semibold' }}>
              <Money value={ownFunds} tag={React.Fragment} />
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginBottom: 8 }}>
              <T id="general.notaryFees" />
            </Text>
            <Text style={{ fontFamily: 'Manrope-semibold' }}>
              ~
              <Money
                value={Math.ceil(notaryFees / 100) * 100}
                tag={React.Fragment}
              />
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
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
      </Page>
    </Document>
  );
};
export default SimpleFinancingCertificate;
