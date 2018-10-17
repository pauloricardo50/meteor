import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation';
import { PropertyAdder } from 'core/components/PropertyForm';
import Page from 'core/components/Page';
import PropertiesPageDetail from './PropertiesPageDetail';
import PromotionDetail from './Promotions/PromotionDetail';

const PropertiesPage = ({
  loan: { _id: loanId, properties, promotions, hasPromotion },
}) => {
  console.log('promotions', promotions);

  return (
    <Page id="PropertiesPage" titleId="PropertiesPage.title">
      <section className="card1 card-top properties-page">
        <div className="promotions">
          {promotions
            && promotions.map(promotion => (
              <PromotionDetail
                promotion={promotion}
                loanId={loanId}
                key={promotion._id}
              />
            ))}
        </div>
        <hr />
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
              button={(
                <div className="property-adder-button">
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
