import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Image } from '@react-pdf/renderer';

import { Money } from '../../../../components/Translation';
import { formatMessage } from '../../../../utils/intl';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';
import PdfDocument from '../PdfDocument';
import PdfPage from '../PdfPage';
import T from '../PdfTranslation';
import { assetUrl } from '../reactPdfHelpers';
import Text from '../Text';
import SimpleFinancingCertificateDetails from './SimpleFinancingCertificateDetails';
import SimpleFinancingCertificateFooter from './SimpleFinancingCertificateFooter';
import SimpleFinancingCertificateHeader from './SimpleFinancingCertificateHeader';

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
  } else if (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE) {
    propertyValue = second.max.propertyValue;
    borrowRatio = second.max.borrowRatio;
  } else {
    throw new Meteor.Error(
      "L'accord de principe en PDF n'est disponible que pour les résidences principales et secondaires pour le moment",
    );
  }

  return (
    <PdfDocument
      title={formatMessage({
        id: 'SimpleFinancingCertificate.pdfTitle',
        values: { name },
      })}
    >
      <PdfPage>
        <SimpleFinancingCertificateHeader name={name} />

        <Image
          src={`${assetUrl}/img/epotek-logo.png`}
          style={{
            width: 120,
            height: 120,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        />

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
      </PdfPage>
    </PdfDocument>
  );
};
export default SimpleFinancingCertificate;
