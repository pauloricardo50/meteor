import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Unverified from '/imports/ui/components/general/Unverified';

import AppItem from './AppItem';

const AppPage = ({ loanRequests, properties, currentUser }) => (
  <section className="flex-col center">
    {!currentUser.emails[0].verified && (
      <div style={{ marginBottom: 16 }}>
        <Unverified />
      </div>
    )}

    {loanRequests.map(request => (
      <AppItem
        key={request._id}
        title={request.name || <T id="AppPage.noName" />}
        subtitle={
          request.status === 'active' ? (
            <T id="AppPage.loanRequest" />
          ) : (
            <T id="AppPage.loanRequest.done" />
          )
        }
        mainText={
          request.status === 'active' ? (
            <span>
              <T id="AppPage.step" values={{ step: request.logic.step }} />
              {!request.name && (
                <span>
                  <br />
                  <span className="active">
                    <T id="AppPage.begin" />
                  </span>
                </span>
              )}
            </span>
          ) : (
            <span className="fa fa-home fa-2x heart-beat active" />
          )
        }
        href={`/app/requests/${request._id}`}
      />
    ))}

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
  </section>
);

AppPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  properties: PropTypes.arrayOf(PropTypes.object),
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppPage.defaultProps = {
  loanRequests: [],
  properties: [],
};

export default AppPage;
