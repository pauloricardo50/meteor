import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation';
import { PropertyAdder } from 'core/components/PropertyForm';
import Page from 'core/components/Page';
import PropertiesPageDetail from './PropertiesPageDetail';
import PropertiesPagePromotions from './PropertiesPagePromotions';

const PropertiesPage = ({ loan }) => {
  const { _id: loanId, properties, hasPromotion } = loan;
  return (
    <Page id="PropertiesPage" titleId="PropertiesPage.title">
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
            <PropertyAdder
              loanId={loanId}
              triggerComponent={handleOpen => (
                <div className="property-adder-button" onClick={handleOpen}>
                  <span className="plus">+</span>
                  <h3>
                    <T id="PropertyForm.adderLabel" />
                  </h3>
                </div>
              )}
              className="properties-page-detail card1 card1-top card-hover"
            />
          )}
        </div>
      </section>
    </Page>
  );
};

PropertiesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PropertiesPage;
