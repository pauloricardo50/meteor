import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { PropertyAdder } from 'core/components/PropertyForm';
import Page from '../../components/Page';
import PropertiesPageDetail from './PropertiesPageDetail';
import { PROPERTY_PAGE } from '../../../startup/client/appRoutes';

const PropertiesPage = ({ loan: { _id: loanId, properties } }) => (
  <Page id="PropertiesPage">
    <section className="mask1 properties-page">
      <h1 className="text-center">
        <T id="PropertiesPage.title" />
      </h1>
      <div className="adder">
        <PropertyAdder loanId={loanId} />
      </div>

      <div className="properties">
        {properties.map(property => (
          <Link
            to={createRoute(PROPERTY_PAGE, {
              ':propertyId': property._id,
              ':loanId': loanId,
            })}
            key={property._id}
          >
            <PropertiesPageDetail property={property} />
          </Link>
        ))}
      </div>
    </section>
  </Page>
);

PropertiesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PropertiesPage;
