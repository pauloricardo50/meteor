import { Meteor } from 'meteor/meteor';

import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';

import { PURCHASE_TYPE } from '../../../api/loans/loanConstants';
import useMedia from '../../../hooks/useMedia';
import Button from '../../Button';
import T, { Money } from '../../Translation';
import { parseMaxPropertyValue } from './maxPropertyValueHelpers';
import MaxPropertyValueResultsTableAcquisition from './MaxPropertyValueResultsTableAcquisition';
import MaxPropertyValueResultsTableRefinancing from './MaxPropertyValueResultsTableRefinancing';
import MaxPropertyValueResultsToggle from './MaxPropertyValueResultsToggle';

const shouldShowToggle = ({
  purchaseType,
  minBorrowRatio,
  maxBorrowRatio,
  minPropertyValue,
  maxPropertyValue,
}) => {
  if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
    return !!minPropertyValue && minPropertyValue !== maxPropertyValue;
  }

  if (purchaseType === PURCHASE_TYPE.REFINANCING) {
    return !!minBorrowRatio && minBorrowRatio !== maxBorrowRatio;
  }
};

const MaxPropertyValueResultsTable = ({ loan, showMoreProps }) => {
  const isSmallMobile = useMedia({ maxWidth: 480 });
  const [showRecap, setShowRecap] = useState(true);
  const [showBest, setShowBest] = useState(true);
  const {
    propertyValue,
    notaryFees,
    ownFunds,
    loanValue,
    raise,
    valueToDisplay,
    minOrganisationName,
    maxOrganisationName,
    previousLoan,
    minBorrowRatio,
    maxBorrowRatio,
    minPropertyValue,
    maxPropertyValue,
  } = parseMaxPropertyValue(loan, showBest);
  const { purchaseType } = loan;

  const prevValueRef = useRef();
  useEffect(() => {
    prevValueRef.current = valueToDisplay;
  }, [valueToDisplay]);

  if (showRecap) {
    return (
      <>
        {shouldShowToggle({
          purchaseType,
          minBorrowRatio,
          maxBorrowRatio,
          minPropertyValue,
          maxPropertyValue,
        }) && (
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
          {...showMoreProps}
        >
          <T id="MaxPropertyValue.showDetail" />
        </Button>
      </>
    );
  }

  return (
    <>
      {!!minPropertyValue && minPropertyValue !== maxPropertyValue && (
        <MaxPropertyValueResultsToggle
          showBest={showBest}
          setShowBest={setShowBest}
          isSmallMobile={isSmallMobile}
          minOrganisationName={minOrganisationName}
          maxOrganisationName={maxOrganisationName}
        />
      )}
      {!!minPropertyValue &&
        minPropertyValue === maxPropertyValue &&
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
          loan={loanValue}
        />
      )}

      {purchaseType === PURCHASE_TYPE.REFINANCING && (
        <MaxPropertyValueResultsTableRefinancing
          loan={loanValue}
          previousLoan={previousLoan}
        />
      )}

      <Button
        className="show-recap-button"
        onClick={() => setShowRecap(true)}
        size="small"
        {...showMoreProps}
      >
        <T id="MaxPropertyValue.showRecap" />
      </Button>
    </>
  );
};

export default MaxPropertyValueResultsTable;
