import { Meteor } from 'meteor/meteor';

import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { withState } from 'recompose';

import useMedia from '../../../hooks/useMedia';
import { PURCHASE_TYPE } from '../../../redux/widget1/widget1Constants';
import Calculator from '../../../utils/Calculator';
import Button from '../../Button';
import T, { Money } from '../../Translation';
import MaxPropertyValueResultsTableAcquisition from './MaxPropertyValueResultsTableAcquisition';
import MaxPropertyValueResultsTableRefinancing from './MaxPropertyValueResultsTableRefinancing';
import MaxPropertyValueResultsToggle from './MaxPropertyValueResultsToggle';

const shouldShowToggle = ({ purchaseType, min, max }) => {
  if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
    return !!min.propertyValue && min.propertyValue !== max.propertyValue;
  }

  if (purchaseType === PURCHASE_TYPE.REFINANCING) {
    return !!min.borrowRatio && min.borrowRatio !== max.borrowRatio;
  }
};

const MaxPropertyValueResultsTable = ({
  min = {},
  max,
  residenceType,
  canton,
  showBest,
  setShowBest,
  purchaseType,
  previousLoan,
  reimbursementPenalty,
}) => {
  const isSmallMobile = useMedia({ maxWidth: 480 });
  const [showRecap, setShowRecap] = useState(true);
  const {
    propertyValue: minPropertyValue,
    borrowRatio: minBorrowRatio,
    organisationName: minOrganisationName,
  } = min;
  const {
    propertyValue: maxPropertyValue,
    borrowRatio: maxBorrowRatio,
    organisationName: maxOrganisationName,
  } = max;

  const minLoan = minPropertyValue * minBorrowRatio;
  const maxLoan = maxPropertyValue * maxBorrowRatio;

  const minNotaryFees = Calculator.getFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: minLoan,
      propertyValue: minPropertyValue,
      canton,
      purchaseType,
    }),
  }).total;
  const maxNotaryFees = Calculator.getFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: maxLoan,
      propertyValue: maxPropertyValue,
      canton,
      purchaseType,
    }),
  }).total;

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio) + minNotaryFees;
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio) + maxNotaryFees;

  const propertyValue = showBest ? maxPropertyValue : minPropertyValue;
  const notaryFees = showBest ? maxNotaryFees : minNotaryFees;
  const ownFunds = showBest ? maxOwnFunds : minOwnFunds;
  const loan = showBest ? maxLoan : minLoan;
  const raise = loan - previousLoan;

  const valueToDisplay =
    purchaseType === PURCHASE_TYPE.REFINANCING ? loan : propertyValue;

  const prevValueRef = useRef();
  useEffect(() => {
    prevValueRef.current = valueToDisplay;
  }, [valueToDisplay]);

  if (showRecap) {
    return (
      <>
        {shouldShowToggle({ purchaseType, min, max }) && (
          <MaxPropertyValueResultsToggle
            showBest={showBest}
            setShowBest={setShowBest}
            isSmallMobile={isSmallMobile}
            minOrganisationName={minOrganisationName}
            maxOrganisationName={maxOrganisationName}
          />
        )}
        <CountUp
          start={prevValueRef.current}
          end={valueToDisplay}
          className="recap-value text-center animated fadeIn"
          duration={1}
          prefix="CHF "
          preserveValue
          separator=" "
        />
        {purchaseType === PURCHASE_TYPE.REFINANCING && raise > 0 && (
          <span className="text-center mt-16">
            <T
              id="MaxPropertyValue.ownFundsRaise"
              values={{ raise: <Money value={raise} /> }}
            />
          </span>
        )}
        <Button
          className="show-recap-button"
          onClick={() => setShowRecap(false)}
          size="small"
        >
          <T id="MaxPropertyValue.showDetail" />
        </Button>
      </>
    );
  }

  return (
    <>
      {!!min.propertyValue && min.propertyValue !== max.propertyValue && (
        <MaxPropertyValueResultsToggle
          showBest={showBest}
          setShowBest={setShowBest}
          isSmallMobile={isSmallMobile}
          minOrganisationName={minOrganisationName}
          maxOrganisationName={maxOrganisationName}
        />
      )}
      {!!min.propertyValue &&
        min.propertyValue === max.propertyValue &&
        Meteor.microservice === 'admin' && (
          <span>
            [ADMIN]&nbsp;
            {minOrganisationName}
          </span>
        )}

      {purchaseType === PURCHASE_TYPE.ACQUISITION && (
        <MaxPropertyValueResultsTableAcquisition
          propertyValue={propertyValue}
          notaryFees={notaryFees}
          ownFunds={ownFunds}
          loan={loan}
        />
      )}

      {purchaseType === PURCHASE_TYPE.REFINANCING && (
        <MaxPropertyValueResultsTableRefinancing
          loan={loan}
          previousLoan={previousLoan}
          reimbursementPenalty={reimbursementPenalty}
        />
      )}

      <Button
        className="show-recap-button"
        onClick={() => setShowRecap(true)}
        size="small"
      >
        <T id="MaxPropertyValue.showRecap" />
      </Button>
    </>
  );
};

export default withState(
  'showBest',
  'setShowBest',
  true,
)(MaxPropertyValueResultsTable);
