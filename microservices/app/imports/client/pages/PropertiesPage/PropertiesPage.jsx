import PropTypes from 'prop-types';
import React from 'react';

import { PropertyAdder } from 'core/components/PropertyForm';
import Page from '../../components/Page';
import PropertiesPageDetail from './PropertiesPageDetail';

const PropertiesPage = ({ loan: { _id: loanId, properties } }) => (
  <Page id="PropertiesPage">
    <section className="card1 card-top properties-page">
      <div className="adder">
        <PropertyAdder loanId={loanId} />
      </div>

      <div className="properties">
        {properties.map(property => (
          <PropertiesPageDetail
            property={property}
            loanId={loanId}
            key={property._id}
          />
        ))}
      </div>
    </section>
  </Page>
);

PropertiesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PropertiesPage;
