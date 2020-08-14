import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faUsdCircle } from '@fortawesome/pro-light-svg-icons/faUsdCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';

import ROUTES from '../../../startup/client/appRoutes';
import LoanCards from '../UserLoansPage/LoanCards';
import { useUserLoans } from '../UserLoansPage/UserLoansPage';

const ProPage = ({ insertLoan }) => {
  const history = useHistory();
  const { data, loading } = useUserLoans();
  const hasLoans = data?.loans?.length > 0;

  return (
    <div className="flex-col center animated fadeIn">
      <h1 className="mb-0">Bienvenue sur e-Potek App</h1>
      <h2 className="mt-0 secondary">Pour les Pros</h2>
      <div className="flex">
        <div
          className="card1 card-top flex-col center mr-16"
          style={{ padding: 40 }}
        >
          <FontAwesomeIcon
            style={{ width: 64, height: 64 }}
            icon={faCity}
            className="font-awesome"
          />

          <Button
            raised
            secondary
            style={{ marginTop: 40 }}
            onClick={() => {
              window.location.replace(Meteor.settings.public.subdomains.pro);
            }}
          >
            Accéder à votre interface Pro
          </Button>
        </div>

        {!loading && !hasLoans && (
          <div
            className="card1 card-top flex-col center"
            style={{ padding: 40 }}
          >
            <FontAwesomeIcon
              style={{ width: 64, height: 64 }}
              icon={faUsdCircle}
              className="font-awesome"
            />

            <Button
              raised
              primary
              style={{ marginTop: 40 }}
              onClick={() =>
                insertLoan({ test: true }).then(loanId => {
                  history.push(
                    createRoute(ROUTES.DASHBOARD_PAGE.path, { loanId }),
                  );
                })
              }
            >
              Créer un dossier test
            </Button>
          </div>
        )}
      </div>

      {!loading && hasLoans && (
        <>
          <h2>Mes dossiers</h2>
          <LoanCards loans={data.loans} />
        </>
      )}
    </div>
  );
};
export default ProPage;
