import React from 'react';
import PropTypes from 'prop-types';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

import PageApp from '../../components/PageApp';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';
import PropertiesPageAdder from './PropertiesPageAdder';
import PropertiesPageDetail from './PropertiesPageDetail';
import PropertiesPagePromotions from './PropertiesPagePromotions';

const PropertiesPage = ({ loan, currentUser }) => {
  const { _id: loanId, properties = [], hasPromotion, applicationType } = loan;
  return (
    <PageApp
      id="PropertiesPage"
      titleId="PropertiesPage.title"
      displayTopBar={applicationType === APPLICATION_TYPES.FULL}
    >
      <section className="card1 card-top properties-page">
        {hasPromotion && <PropertiesPagePromotions loan={loan} />}

        <div className="properties">
          {properties.map(property => (
            <PropertiesPageDetail
              property={property}
              loanId={loanId}
              key={property._id}
            />
          ))}

          {!hasPromotion && (
            <PropertiesPageAdder loanId={loanId} currentUser={currentUser} />
          )}
        </div>
      </section>
    </PageApp>
  );
};

PropertiesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withSimpleAppPage(PropertiesPage);
