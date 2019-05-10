// @flow
import React from 'react';

import T, { Money } from 'core/components/Translation';
import Button from 'core/components/Button';
import { WelcomeScreen } from '../../../components/WelcomeScreen/WelcomeScreen';
import PropertyStartPageContainer from './PropertyStartPageContainer';

type PropertyStartPageProps = {};

const PropertyStartPage = ({
  anonymousProperty: { name, totalValue, address1 },
  insertAnonymousLoan,
}: PropertyStartPageProps) => (
  <WelcomeScreen
    displayCheckbox={false}
    cta={(
      <div className="property-start">
        <h3>{name || address1}</h3>
        <h4 className="secondary">
          <Money value={totalValue} />
        </h4>

        <Button raised secondary onClick={insertAnonymousLoan}>
          <T id="PropertyStartPage.buttonLabel" />
        </Button>
      </div>
    )}
  />
);

export default PropertyStartPageContainer(PropertyStartPage);
