import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';
import PageApp from '../../components/PageApp';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';
import PropertiesPageDetail from './PropertiesPageDetail';
import PropertiesPagePromotions from './PropertiesPagePromotions';
import PropertiesPageAdder from './PropertiesPageAdder';

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
