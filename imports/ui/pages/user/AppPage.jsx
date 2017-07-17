import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';
import AppItem from './appPage/AppItem.jsx';

const AppPage = ({ loanRequests, properties }) =>
  (<section className="flex-col center">
    {loanRequests.map(request =>
      (<AppItem
        key={request._id}
        title={request.name || <T id="AppPage.noName" />}
        subtitle={<T id="AppPage.loanRequest" />}
        mainText={<T id="AppPage.step" values={{ step: request.logic.step }} />}
        href={`/app/requests/${request._id}`}
      />),
    )}

    <AppItem
      title={<T id="AppPage.comparator" />}
      mainText={
        <T id="AppPage.properties" values={{ count: properties.length }} />
      }
      href="/app/compare"
    />

    <AppItem
      title={<T id="AppPage.newRequest" />}
      mainText={<span className="active">+</span>}
      href="/start1/acquisition"
    />
  </section>);

AppPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  properties: PropTypes.arrayOf(PropTypes.object),
};

AppPage.defaultProps = {
  loanRequests: [],
  properties: [],
};

export default AppPage;
