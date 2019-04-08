// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { createRoute } from 'core/utils/routerUtils';
import Button from 'core/components/Button';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Calculator from 'core/utils/Calculator';
import { loanUpdate } from 'core/api/methods';
import { APPLICATION_TYPES } from 'core/api/constants';
import { BORROWERS_PAGE_NO_TAB } from '../../../../startup/client/appRoutes';
import BorrowersProgressRecap from './BorrowersProgressRecap';

type BorrowersProgressProps = {};

const BorrowersProgress = ({ loan }: BorrowersProgressProps) => {
  const { borrowers, _id: loanId } = loan;
  const progress = Calculator.personalInfoPercentSimple({ loan });
  return (
    <div className="borrowers-progress">
      <h3>
        <T id="BorrowersProgress.title" />
      </h3>
      <div className="borrowers-progress-cta">
        <span className="secondary">
          <T
            id="BorrowersProgress.progress"
            values={{
              percent: (
                <>
                  &nbsp;
                  <PercentWithStatus
                    value={progress}
                    status={progress < 1 ? null : undefined}
                    rounded
                  />
                </>
              ),
            }}
          />
        </span>

        <Button
          raised={progress < 1}
          primary
          link
          to={createRoute(BORROWERS_PAGE_NO_TAB, { loanId })}
        >
          <T id={progress < 1 ? 'general.continue' : 'general.modify'} />
        </Button>
      </div>

      <div className="borrowers-progress-borrowers">
        {borrowers.map((borrower, index) => [
          index !== 0 && <hr />,
          <BorrowersProgressRecap
            key={borrower._id}
            borrower={borrower}
            index={index}
          />,
        ])}
      </div>

      <ConfirmMethod
        buttonProps={{
          primary: true,
          label: <T id="BorrowersProgress.fullApplication" />,
        }}
        method={() =>
          loanUpdate.run({
            loanId,
            object: { applicationType: APPLICATION_TYPES.FULL },
          })
        }
        title={<T id="BorrowersProgress.fullApplication" />}
        description={<T id="BorrowersProgress.fullApplicationDescription" />}
      />
    </div>
  );
};

export default BorrowersProgress;
