import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { APPLICATION_TYPES, PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';
import PageApp from '../../components/PageApp';
import PropertiesPageAdder from './PropertiesPageAdder';
import PropertiesPageDetail from './PropertiesPageDetail';
import PropertiesPagePromotions from './PropertiesPagePromotions';

const PropertiesPage = ({ loan }) => {
  const { _id: loanId, properties = [], hasPromotion, purchaseType } = loan;

  if (properties.length === 1 && purchaseType !== PURCHASE_TYPE.ACQUISITION) {
    // In loans that never need multiple properties, route to the first one
    return (
      <Redirect
        to={createRoute(APP_ROUTES.PROPERTY_PAGE.path, {
          ':propertyId': properties[0]._id,
          ':loanId': loanId,
        })}
      />
    );
  }

  return (
    <PageApp id="PropertiesPage" titleId="PropertiesPage.title">
      <section className="properties-page">
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
            <PropertiesPageAdder loanId={loanId} purchaseType={purchaseType} />
          )}
        </div>
      </section>
    </PageApp>
  );
};

PropertiesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PropertiesPage;
