// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometer } from '@fortawesome/pro-light-svg-icons/faTachometer';

import Calculator from 'core/utils/Calculator';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { loanUpdate } from 'core/api/methods/index';
import { APPLICATION_TYPES, STEPS } from 'core/api/constants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import APP_ROUTES from 'imports/startup/client/appRoutes';
import UserCreator from '../../components/UserCreator/UserCreator';

type SimpleBorrowersPageCTAsProps = {};

const SimpleBorrowersPageCTAs = (props: SimpleBorrowersPageCTAsProps) => {
  const { currentUser, loan, simpleForm } = props;
  const { _id: loanId } = loan;
  const progress = Calculator.personalInfoPercentSimple({
    loan,
    simple: simpleForm,
  });
  return (
    <div className="simple-borrowers-page-ctas">
      <Button
        link
        to={createRoute(APP_ROUTES.DASHBOARD_PAGE.path, {
          loanId: loan._id,
        })}
        raised
        primary
        icon={<FontAwesomeIcon icon={faTachometer} />}
      >
        Tableau de bord
      </Button>
      {!currentUser && (
        <UserCreator
          buttonProps={{
            primary: progress < 1,
            secondary: progress >= 1,
            raised: true,
            label: <T id="BorrowersProgress.fullApplication" />,
            icon: <Icon type="right" />,
            iconAfter: true,
          }}
        />
      )}

      {currentUser && (
        <ConfirmMethod
          buttonProps={{
            primary: progress < 1,
            secondary: progress >= 1,
            raised: true,
            label: <T id="BorrowersProgress.fullApplication" />,
            icon: <Icon type="right" />,
            iconAfter: true,
          }}
          method={() =>
            loanUpdate.run({
              loanId,
              object: {
                applicationType: APPLICATION_TYPES.FULL,
                step: STEPS.REQUEST,
              },
            })
          }
          title={<T id="BorrowersProgress.fullApplication" />}
          description={<T id="BorrowersProgress.fullApplicationDescription" />}
        />
      )}
    </div>
  );
};

export default SimpleBorrowersPageCTAs;
