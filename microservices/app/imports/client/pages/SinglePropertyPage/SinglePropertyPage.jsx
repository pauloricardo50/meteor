import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation';
import { PROPERTY_CATEGORY, APPLICATION_TYPES } from 'core/api/constants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import { propertyDelete } from 'core/api/methods/index';
import { createRoute } from 'core/utils/routerUtils';
import ProProperty from 'core/components/ProProperty';
import APP_ROUTES from '../../../startup/client/appRoutes';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import PageApp from '../../components/PageApp';
import SinglePropertyPageTitle from './SinglePropertyPageTitle';
import SinglePropertyPageForms from './SinglePropertyPageForms';
import SinglePropertyPageContainer from './SinglePropertyPageContainer';

const SinglePropertyPage = (props) => {
  console.log('props:', props);
  const { loan, propertyId, history, currentUser } = props;
  const { loans } = currentUser || {};
  const {
    borrowers,
    properties,
    _id: loanId,
    residenceType,
    applicationType,
  } = loan;
  const property = properties.find(({ _id }) => _id === propertyId);

  if (property.category === PROPERTY_CATEGORY.PRO) {
    return (
      <ProProperty
        property={property}
        simple={applicationType === APPLICATION_TYPES.SIMPLE}
        loan={loan}
      />
    );
  }

  if (!property) {
    // Do this when deleting the property, so it doesn't display a giant error
    // before routing to the properties page
    return null;
  }

  const { address1, zipCode, city } = property;

  const title = address1 || <T id="SinglePropertyPage.title" />;

  return (
    <PageApp
      id="SinglePropertyPage"
      title={<SinglePropertyPageTitle loan={loan} property={property} />}
      displayTopBar={applicationType === APPLICATION_TYPES.FULL}
    >
      <section className="card1 card-top property-page">
        <h1 className="text-center">{title}</h1>

        <ConfirmMethod
          buttonProps={{
            error: true,
            outlined: true,
            className: 'property-deleter',
          }}
          method={() =>
            propertyDelete.run({ propertyId, loanId }).then(() =>
              history.push(createRoute(APP_ROUTES.PROPERTIES_PAGE.path, {
                ':loanId': loan._id,
              })))
          }
          label={<T id="general.delete" />}
        >
          {loans.length > 1 && (
            <p>
              Si ce bien immobilier est utilisé dans plusieurs de vos dossiers,
              il ne sera pas supprimé dans les autres dossiers
            </p>
          )}
        </ConfirmMethod>

        <MapWithMarkerWrapper
          address1={address1}
          city={city}
          zipCode={zipCode}
          options={{ zoom: 15 }}
        />

        <SinglePropertyPageForms
          loan={loan}
          borrowers={borrowers}
          property={property}
        />
      </section>
      <div className="single-property-page-buttons">
        <ReturnToDashboard />
      </div>
    </PageApp>
  );
};

SinglePropertyPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SinglePropertyPageContainer(SinglePropertyPage);
