//      
import React from 'react';
import { Redirect } from 'react-router-dom';

import T, { Money } from 'core/components/Translation';
import Button from 'core/components/Button';
import { WelcomeScreen } from '../../../components/WelcomeScreen/WelcomeScreen';
import PropertyStartPageContainer from './PropertyStartPageContainer';

                                 

const PropertyStartPage = ({
  anonymousProperty,
  insertLoan,
}                        ) => {
  if (!anonymousProperty) {
    return <Redirect to="/" />;
  }

  const { name, totalValue, address1 } = anonymousProperty;
  return (
    <WelcomeScreen
      displayCheckbox={false}
      cta={
        <div className="property-start">
          <h3>{name || address1}</h3>
          <h4 className="secondary">
            <Money value={totalValue} />
          </h4>

          <Button
            className="welcome-screen-cta"
            raised
            secondary
            onClick={insertLoan}
          >
            <T id="PropertyStartPage.buttonLabel" />
          </Button>
        </div>
      }
      img={anonymousProperty.thumbnail}
    />
  );
};

export default PropertyStartPageContainer(PropertyStartPage);
