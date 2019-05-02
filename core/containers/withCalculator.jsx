import React from 'react';
import { compose } from 'recompose';
import omit from 'lodash/omit';

import { lenderRules as lenderRulesFragment } from 'core/api/fragments';
import { withSmartQuery } from '../api/containerToolkit';
import Calculator, { Calculator as CalculatorClass } from '../utils/Calculator';
import query from '../api/lenderRules/queries/organisationLenderRules';

export const { Consumer, Provider } = React.createContext();

const getCalculator = ({ loan, lenderRules = [] }, structureId) => {
  let finalLenderRules = lenderRules;
  if (loan && loan.structure && loan.structure.offerId) {
    finalLenderRules = loan.structure.offer.lender.organisation.lenderRules;
  }

  if (finalLenderRules.length) {
    console.log('new calculator, optimize this!');
    
    return new CalculatorClass({ loan, structureId, lenderRules: finalLenderRules });
  }
  return Calculator;
};

const body = omit(lenderRulesFragment(), [
  'adminComments',
  'createdAt',
  'name',
  'pdfComments',
  'updatedAt',
]);

const getParams = ({ loan }) => {
  if (loan && loan.structure && loan.structure.offerId) {
    return false;
  }

  if (loan && loan.hasPromotion) {
    const { lenderOrganisationLink } = loan.promotions[0];
    if (lenderOrganisationLink) {
      return {
        organisationId: lenderOrganisationLink._id,
        $body: body,
      };
    }
  }

  return false;
};

const withLenderRules = withSmartQuery({
  query,
  params: getParams,
  queryOptions: { shouldRefetch: () => false },
  refetchOnMethodCall: false,
  dataName: 'lenderRules',
});

export const injectCalculator = (getStructureId = () => {}) =>
  compose(Component => (props) => {
    let WrappedComponent = Component;
    if (getParams(props)) {
      WrappedComponent = withLenderRules(Component);
    }

    return (
      <Provider value={getCalculator(props, getStructureId(props))}>
        <WrappedComponent {...props} />
      </Provider>
    );
  });

export const withCalculator = Component => props => (
  <Consumer>
    {(calc) => {
      console.log('calc:', calc);

      return <Component {...props} Calculator={calc} />;
    }}
  </Consumer>
);
