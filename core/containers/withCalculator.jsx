import React from 'react';
import { compose, wrapDisplayName } from 'recompose';
import omit from 'lodash/omit';

import { lenderRules as lenderRulesFragment } from 'core/api/fragments';
import memoizeOne from 'core/utils/memoizeOne';
import withContextConsumer from 'core/api/containerToolkit/withContextConsumer';
import { withSmartQuery } from '../api/containerToolkit';
import Calculator, { Calculator as CalculatorClass } from '../utils/Calculator';
import query from '../api/lenderRules/queries/organisationLenderRules';

const Context = React.createContext();
const { Consumer, Provider } = Context;

const getCalculatorFunc = ({ loan, lenderRules = [] }, structureId) => {
  if (lenderRules.length) {
    console.log('new calculator!');
    
    return new CalculatorClass({
      loan,
      structureId,
      lenderRules,
    });
  }
  return Calculator;
};

const getLenderRules = ({ loan, lenderRules }) => {
  let finalLenderRules = lenderRules;
  if (loan && loan.structure && loan.structure.offerId) {
    finalLenderRules = loan.structure.offer.lender.organisation.lenderRules;
  }

  return finalLenderRules;
};

// Memoize calculator creation, because it takes a lot of effort to recreate it
// Calculation with lenderRules takes roughly 6ms, taken down to 0.01ms with memoization
const getCalculatorMemo = () =>
  memoizeOne(
    getCalculatorFunc,
    (
      [{ lenderRules = [] }, structureId],
      [{ lenderRules: newLenderRules = [] }, newStructureId],
    ) => {
      // FIXME: This caching strategy is not perfect, other things can change
      // on a loan that should recreate a calculator, such as changing
      // cantons, residencyType, etc.
      // Let's assume these changes don't happen too often
      if (structureId !== newStructureId) {
        return false;
      }

      if (lenderRules.length !== newLenderRules.length) {
        return false;
      }

      // LenderRules from different orgs are always all different
      // So if the same _id can be found from one array to the other,
      // the org hasn't changed
      if (
        lenderRules[0]
        && !newLenderRules.find(({ _id }) => _id === lenderRules[0]._id)
      ) {
        return false;
      }

      return true;
    },
  );

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

const withLenderRules = (Component) => {
  const WrappedComponent = withSmartQuery({
    query,
    params: getParams,
    queryOptions: { shouldRefetch: () => false, loadOnRefetch: false },
    refetchOnMethodCall: false,
    dataName: 'lenderRules',
  })(Component);

  return (props) => {
    // Only fetch lender Rules if necessary
    if (getParams(props)) {
      return <WrappedComponent {...props} />;
    }

    return <Component {...props} />;
  };
};

export const injectCalculator = (getStructureId = () => {}) => {
  // Insnstantiate a new memoizer for each place where this is calculated
  const getCalculator = getCalculatorMemo();

  return compose(
    withLenderRules,
    Component => (props) => {
      const { loan } = props;
      const lenderRules = getLenderRules(props);

      const calculator = getCalculator(
        { loan, lenderRules },
        getStructureId(props),
      );

      const WrappedComponent = (
        <Provider value={calculator}>
          <Component {...props} />
        </Provider>
      );

      WrappedComponent.displayName = wrapDisplayName(
        WrappedComponent,
        'InjectCalculator',
      );

      return WrappedComponent;
    },
  );
};

export const withCalculator = withContextConsumer({
  Context,
  contextName: 'Calculator',
});
