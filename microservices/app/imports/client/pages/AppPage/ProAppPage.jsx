import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faUsdCircle } from '@fortawesome/pro-light-svg-icons/faUsdCircle';
import { withRouter } from 'react-router-dom';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from '../../../startup/client/appRoutes';

const ProAppPage = ({ loans, history, insertLoan }) => (
  <div className="flex center space-children">
    <div className="card1 card-top flex-col center" style={{ padding: 40 }}>
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
    <div className="card1 card-top flex-col center" style={{ padding: 40 }}>
      <FontAwesomeIcon
        style={{ width: 64, height: 64 }}
        icon={faUsdCircle}
        className="font-awesome"
      />

      <Button
        raised
        primary
        style={{ marginTop: 40 }}
        onClick={() => {
          if (loans.length) {
            history.push(createRoute(DASHBOARD_PAGE, { loanId: loans[0]._id }));
          } else {
            insertLoan({ test: true }).then(loanId => {
              history.push(createRoute(DASHBOARD_PAGE, { loanId }));
            });
          }
        }}
      >
        Faire un dossier test
      </Button>
    </div>
  </div>
);

export default withRouter(ProAppPage);
