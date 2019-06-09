// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withState } from 'recompose';
import cx from 'classnames';

import useMedia from '../../hooks/useMedia';
import Calculator from '../../utils/Calculator';
import Toggle from '../Toggle';
import { Money } from '../Translation';

type MaxPropertyValueResultsTableProps = {
  min: Object,
  max: Object,
};

const MaxPropertyValueResultsTable = ({
  min = {},
  max,
  residenceType,
  canton,
  showBest,
  setShowBest,
}: MaxPropertyValueResultsTableProps) => {
  const isSmallMobile = useMedia({ maxWidth: 480 });
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
    }),
  }).total;
  const maxNotaryFees = Calculator.getFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: maxLoan,
      propertyValue: maxPropertyValue,
      canton,
    }),
  }).total;

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio) + minNotaryFees;
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio) + maxNotaryFees;

  const propertyValue = showBest ? maxPropertyValue : minPropertyValue;
  const notaryFees = showBest ? maxNotaryFees : minNotaryFees;
  const ownFunds = showBest ? maxOwnFunds : minOwnFunds;
  const loan = showBest ? maxLoan : minLoan;

  return (
    <>
      {!!min.propertyValue && min.propertyValue !== max.propertyValue && (
        <Toggle
          className="show-best-toggle"
          toggled={showBest}
          onToggle={(_, v) => setShowBest(v)}
          labelLeft={(
            <div className="flex-col">
              <span className={cx({ secondary: showBest })}>
                {isSmallMobile
                  ? 'Le moins compétitif'
                  : 'Prêteur le - compétitif'}
              </span>
              {Meteor.microservice === 'admin' && (
                <span>
                  [ADMIN]&nbsp;
                  {minOrganisationName}
                </span>
              )}
            </div>
          )}
          labelRight={(
            <div className="flex-col">
              <span className={cx({ secondary: !showBest })}>
                {isSmallMobile
                  ? 'Le plus compétitif'
                  : 'Prêteur le + compétitif'}
              </span>
              {Meteor.microservice === 'admin' && (
                <span>
                  [ADMIN]&nbsp;
                  {maxOrganisationName}
                </span>
              )}
            </div>
          )}
        />
      )}
      {!!min.propertyValue
        && min.propertyValue === max.propertyValue
        && Meteor.microservice === 'admin' && (
        <span>
            [ADMIN]&nbsp;
          {minOrganisationName}
        </span>
      )}

      <div className="balance-sheet">
        <div className="left">
          <span className="label">Prix d'achat max.</span>
          <Money className="money bold" value={propertyValue} />
          <span className="label">Frais de notaire</span>
          <Money className="money bold" value={notaryFees} />
        </div>
        <div className="right">
          <span className="label">Fonds propres</span>
          <Money className="money bold" value={ownFunds} />
          <span className="label">Hypothèque</span>
          <Money className="money bold" value={loan} />
        </div>
      </div>
      <hr />
      <div className="sums">
        <div className="left">
          <span className="label">Coût total</span>
          <Money className="money bold" value={propertyValue + notaryFees} />
        </div>
        <div className="right">
          <span className="label">Financement total</span>
          <Money className="money bold" value={ownFunds + loan} />
        </div>
      </div>
    </>
  );
};

export default withState('showBest', 'setShowBest', true)(MaxPropertyValueResultsTable);
