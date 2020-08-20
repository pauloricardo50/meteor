import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import {
  loanLinkProperty,
  userLoanInsert,
} from 'core/api/loans/methodDefinitions';
import { anonymousProperty } from 'core/api/properties/queries';
import Button from 'core/components/Button';
import NotFound from 'core/components/NotFound';
import ProProperty from 'core/components/ProProperty';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';
import useAnonymousLoan from '../../hooks/useAnonymousLoan';
import { insertAnonymousLoan } from '../OnboardingPage/onboardingHelpers';

const youngestFirst = ({ createdAt: A }, { createdAt: B }) =>
  B.getTime() - A.getTime();

const getCta = ({ propertyId, currentUser, history, anonymousLoan }) => {
  const routeToLoan = loanId =>
    history.push(createRoute(appRoutes.DASHBOARD_PAGE.path, { loanId }));

  if (currentUser) {
    // If the user already has a loan with this property, route him to the loan
    // this case shouldn't happen very often
    const loanWithProperty = currentUser.loans?.find(({ propertyIds }) =>
      propertyIds.includes(propertyId),
    );
    if (loanWithProperty) {
      return {
        label: <T id="general.continue" />,
        onClick: () => routeToLoan(loanWithProperty._id),
      };
    }

    // Can't add a proProperty to a loan with a promotion
    // This always picks the first loan, could be improved to provide a
    // selector
    const compatibleLoan = currentUser.loans
      ?.sort(youngestFirst)
      .find(({ promotionLinks = [] }) => !promotionLinks.length);
    if (compatibleLoan) {
      return {
        label: <T id="ProPropertyPage.addPropertyToLoan" />,
        onClick: () =>
          loanLinkProperty
            .run({ loanId: compatibleLoan._id, propertyId })
            .then(() => routeToLoan(compatibleLoan._id)),
      };
    }

    return {
      label: <T id="ProPropertyPage.getALoan" />,
      onClick: () =>
        userLoanInsert.run({ proPropertyId: propertyId }).then(routeToLoan),
    };
  }

  if (anonymousLoan) {
    return {
      label: <T id="ProPropertyPage.addPropertyToLoan" />,
      onClick: () =>
        insertAnonymousLoan({ proPropertyId: propertyId }).then(routeToLoan),
    };
  }

  return {
    label: <T id="ProPropertyPage.getALoan" />,
    onClick: () =>
      insertAnonymousLoan({ proPropertyId: propertyId }).then(routeToLoan),
  };
};

const ProPropertyPage = ({ property }) => {
  const currentUser = useCurrentUser();
  const [buttonLoading, setButtonLoading] = useState();
  const { anonymousLoan, loading } = useAnonymousLoan({
    propertyIds: 1,
    hasPromotion: 1,
  });
  const history = useHistory();

  if (loading) {
    return null;
  }

  if (!property) {
    return <NotFound />;
  }

  const { label, onClick } = getCta({
    propertyId: property._id,
    currentUser,
    history,
    anonymousLoan,
  });

  return (
    <div>
      <div className="flex sb mb-16">
        <Button
          raised
          primary
          onClick={() => {
            history.goBack();
          }}
        >
          <T id="general.back" />
        </Button>

        <Button
          raised
          secondary
          loading={buttonLoading}
          onClick={() => {
            setButtonLoading(true);
            Promise.resovle(onClick()).catch(() => setButtonLoading(false));
          }}
          size="large"
        >
          {label}
        </Button>
      </div>

      <ProProperty property={property} />

      <div className="flex fe mt-16">
        <Button
          raised
          secondary
          loading={buttonLoading}
          onClick={() => {
            setButtonLoading(true);
            onClick();
          }}
          size="large"
        >
          {label}
        </Button>
      </div>
    </div>
  );
};

export default compose(
  withMatchParam('propertyId'),
  withSmartQuery({
    query: anonymousProperty,
    params: ({ propertyId }) => ({
      _id: propertyId,
      $body: {
        address1: 1,
        thumbnail: 1,
        name: 1,
        openGraphData: 1,
        totalValue: 1,
      },
    }),
    queryOptions: { single: true },
    deps: ({ propertyId }) => [propertyId],
    dataName: 'property',
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
)(ProPropertyPage);
