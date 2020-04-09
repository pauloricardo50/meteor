import React from 'react';
import moment from 'moment';

import T from '../../../../../../components/Translation';
import Calculator from '../../../../../../utils/Calculator';
import { PROPERTY_TYPE } from '../../../../../properties/propertyConstants';
import PdfPage from '../../PdfPage';
import LoanBankCoverHeader from './LoanBankCoverHeader';
import StructureRecapTable from './StructureRecapTable';

const footer = ({ name, email, phoneNumbers }) => (
  <div className="cover-footer">
    <div className="assigned-employee">
      <h5 className="name">{name}</h5>
      <h5>{email}</h5>
      <h5>{phoneNumbers[0]}</h5>
    </div>
    <div>{moment(new Date()).format('DD.MM.YYYY')}</div>
  </div>
);

const borrowersNames = borrowers => (
  <h3 className="borrowers">
    {borrowers.map(({ name }) => name).join(' et ')}
  </h3>
);

const getPropertyType = ({ propertyType, houseType, flatType }) => {
  switch (propertyType) {
    case PROPERTY_TYPE.HOUSE:
      return (
        <span>
          <T id="Forms.propertyType.HOUSE" />
          &nbsp;
          {!!houseType && <T id={`Forms.houseType.${houseType}`} />}
        </span>
      );
    case PROPERTY_TYPE.FLAT:
      return flatType ? (
        <T id={`Forms.flatType.${flatType}`} />
      ) : (
        <T id="Forms.propertyType.FLAT" />
      );
    default:
      return <T id={`Forms.propertyType.${propertyType}`} />;
  }
};

const coverContent = ({
  loan,
  anonymous = false,
  organisation,
  structureIds,
  calculator,
  backgroundInfo,
}) => {
  const { residenceType, purchaseType, borrowers, disbursementDate } = loan;
  const {
    address1,
    zipCode,
    city,
    propertyType,
    houseType,
    flatType,
    canton,
  } = Calculator.selectProperty({ loan });
  const propertyValue = Calculator.selectPropertyValue({ loan });

  return (
    <div className="cover-content">
      {organisation && (
        <img src={organisation.logo} className="organisation-logo" />
      )}
      <h1 className="title">Demande de financement hypothécaire</h1>
      {!anonymous && borrowersNames(borrowers)}
      <h2 className="loan-type">
        <T id={`PDF.purchaseType.${purchaseType}`} />{' '}
        <T id={`PDF.residenceType.${residenceType}`} />
      </h2>
      <h2 className="property-type">
        {getPropertyType({ propertyType, flatType, houseType })}
      </h2>
      <h2 className="address">{`${address1}, ${zipCode} ${city} (${canton})`}</h2>
      <h3 className="disbursement-date">
        <span>
          Déblocage des fonds prévu le{' '}
          <b>{moment(disbursementDate).format('DD.MM.YYYY')}</b>
        </span>
      </h3>
      <StructureRecapTable
        loan={loan}
        organisation={organisation}
        structureIds={structureIds}
      />
      <div className="loan-background-info">
        <h5>Notes sur le dossier</h5>
        <p>{backgroundInfo}</p>
      </div>
    </div>
  );
};

const LoanBankCover = ({
  loan,
  pageNb,
  pageCount,
  options,
  organisation,
  structureIds,
  backgroundInfo,
}) => (
  <PdfPage
    className="cover-page"
    fullHeight
    pageNb={pageNb}
    pageCount={pageCount}
  >
    <LoanBankCoverHeader loanName={loan.name} />
    {coverContent({
      loan,
      anonymous: options && options.anonymous,
      organisation,
      structureIds,
      backgroundInfo,
    })}
    {footer(loan.user.assignedEmployee)}
  </PdfPage>
);

export default LoanBankCover;
