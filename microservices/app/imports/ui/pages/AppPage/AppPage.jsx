import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DashboardUnverified from '/imports/ui/components/DashboardUnverified';
import { REQUEST_STATUS } from 'core/api/constants';

import AppItem from './AppItem';

const AppPage = ({ loanRequests, properties, currentUser }) => (
  <section className="flex-col center">
    {!currentUser.emails[0].verified && (
      <div style={{ marginBottom: 16 }}>
        <DashboardUnverified />
      </div>
    )}

    {loanRequests.map(request => (
      <AppItem
        key={request._id}
        title={request.name || <T id="AppPage.noName" />}
        subtitle={
          request.status === REQUEST_STATUS.ACTIVE ? (
            <T id="AppPage.loanRequest" />
          ) : (
            <T id="AppPage.loanRequest.done" />
          )
        }
        mainText={
          request.status === REQUEST_STATUS.ACTIVE ? (
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
        href={`/requests/${request._id}`}
      />
    ))}

    {/* <AppItem
      title={<T id="AppPage.comparator" />}
      mainText={
        <T id="AppPage.properties" values={{ count: properties.length }} />
      }
      href="/compare"
    /> */}

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
