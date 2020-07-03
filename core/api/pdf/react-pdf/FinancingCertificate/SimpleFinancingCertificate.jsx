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

import intl from 'core/utils/intl';

import { toMoney } from '../../../../utils/conversionFunctions';
import { CANTONS } from '../../../loans/loanConstants';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';
import Text from '../Text';

Font.register({
  family: 'Manrope-regular',
  src: '/fonts/Manrope-Light.ttf',
  fontWeight: 300,
});
Font.register({
  family: 'Manrope-bold',
  src: '/fonts/Manrope-SemiBold.ttf',
  fontWeight: 600,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Manrope-regular',
    padding: '25mm',
    fontSize: 12,
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

// Create Document Component
const SimpleFinancingCertificate = ({ loan = {} }) => {
  const {
    name = '20-0001',
    borrowers,
    maxPropertyValue: { canton = 'GE', main, second } = {},
    residenceType,
  } = loan;
  let value;
  let borrowRatio;

  if (residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE) {
    value = main.max.propertyValue;
    borrowRatio = main.max.borrowRatio;
  }
  if (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE) {
    value = second.max.propertyValue;
    borrowRatio = second.max.borrowRatio;
  }

  const { formatMessage } = intl;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerLeft} size={10}>
          {moment().format('D MMMM YYYY, à HH:mm')}
        </Text>
        <Text style={styles.headerRight} size={10}>
          {formatMessage({
            id: 'SimpleFinancingCertificate.loanName',
            values: { name },
          })}
        </Text>

        <Image src="/img/epotek-logo.png" style={styles.logo} />

        <Text size={24} style={{ alignSelf: 'center', marginBottom: 8 }}>
          {formatMessage({ id: 'SimpleFinancingCertificate.title' })}
        </Text>
        <Text
          size={16}
          style={{ alignSelf: 'center', opacity: 0.7, marginBottom: 40 }}
        >
          {formatMessage({ id: 'SimpleFinancingCertificate.subtitle' })}
        </Text>

        <Text style={{ marginBottom: 32 }}>
          {formatMessage({
            id: 'SimpleFinancingCertificate.text',
            values: {
              name1: borrowers?.[0]?.name,
              name2: borrowers?.[1]?.name || false,
            },
          })}
        </Text>

        <Text size={36} style={{ alignSelf: 'center', marginBottom: 8 }}>
          CHF {toMoney(value)}
        </Text>
        <Text
          size={10}
          style={{ alignSelf: 'center', opacity: 0.5, marginBottom: 64 }}
        >
          {formatMessage({ id: `Forms.residenceType.${residenceType}` })} –{' '}
          {formatMessage({ id: `Forms.canton.${canton}` })}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginBottom: 8 }}>
              {formatMessage({ id: 'Forms.mortgageLoan' })}
            </Text>
            <Text style={{ fontFamily: 'Manrope-bold' }}>
              CHF {toMoney(value * borrowRatio)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginBottom: 8 }}>
              {formatMessage({ id: 'Forms.ownFunds' })}
            </Text>
            <Text style={{ fontFamily: 'Manrope-bold' }}>
              CHF {toMoney(value * (1 - borrowRatio))}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginBottom: 8 }}>
              {formatMessage({ id: 'Forms.notaryFees' })}
            </Text>
            <Text style={{ fontFamily: 'Manrope-bold' }}>CHF 5 000</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            size={7}
            style={{
              textAlign: 'center',
              marginBottom: 16,
              marginRight: 8,
              marginLeft: 8,
            }}
          >
            {formatMessage({ id: 'SimpleFinancingCertificate.disclaimer' })}
          </Text>
          <Text size={10}>
            {formatMessage({
              id:
                canton === 'GE'
                  ? 'SimpleFinancingCertificate.footerGE'
                  : 'SimpleFinancingCertificate.footerVD',
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
export default SimpleFinancingCertificate;
