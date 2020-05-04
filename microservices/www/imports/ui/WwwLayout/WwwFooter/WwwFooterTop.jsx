import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withRouter } from 'react-router-dom';

import CTAS from 'core/api/analytics/ctas';
import { ctaClicked } from 'core/api/analytics/helpers';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { WWW_ROUTES } from '../../../startup/shared/Routes';

const WwwFooterTop = ({ children, history }) => {
  if (children) {
    return (
      <div className="www-footer-top">
        {React.Children.map(children, child => React.cloneElement(child))}
      </div>
    );
  }
  return (
    <div className="www-footer-top">
      <b className="tagline">
        <h3>
          <T id="HomePageHeader.title" />
        </h3>
      </b>
      <Button
        className="cta"
        raised
        href={Meteor.settings.public.subdomains.app}
        onClick={() => {
          ctaClicked({
            name: CTAS.START_BOTTOM,
            history,
            routes: WWW_ROUTES,
          });
        }}
      >
        <T id="general.start" />
      </Button>
    </div>
  );
};

export default withRouter(WwwFooterTop);
