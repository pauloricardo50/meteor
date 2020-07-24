import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import CTAS from 'core/api/analytics/ctas';
import { ctaClicked } from 'core/api/analytics/helpers';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Waves from 'core/components/Waves';
import useMedia from 'core/hooks/useMedia';

import { WWW_ROUTES } from '../../../../startup/shared/Routes';
import HomePageHeaderDevice from './HomePageHeaderDevice';

const HomePageHeader = ({ history }) => {
  const isLarge = useMedia({ minWidth: 768 });

  return (
    <header>
      <div className="text">
        <b>
          <h1>
            <T id="HomePageHeader.title" />
          </h1>
        </b>
        <span className="separator" />
        <h4>
          <T id="HomePageHeader.description" />
        </h4>
        <div className="buttons">
          <Button
            size="large"
            secondary
            raised
            href={Meteor.settings.public.subdomains.app}
            onClick={() => {
              ctaClicked({
                name: CTAS.START,
                history,
                routes: WWW_ROUTES,
                toPath: Meteor.settings.public.subdomains.app,
              });
            }}
            style={{ marginRight: 8 }}
          >
            <T id="HomePageHeader.acquisition" />
          </Button>
          <Button size="large" raised link to={WWW_ROUTES.WIDGET1_PAGE.path}>
            <T id="HomePageHeader.calculator" />
          </Button>
        </div>
      </div>
      <HomePageHeaderDevice />
      <Waves noSlope={false} />
      {isLarge && <div />}
    </header>
  );
};

HomePageHeader.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(HomePageHeader);
