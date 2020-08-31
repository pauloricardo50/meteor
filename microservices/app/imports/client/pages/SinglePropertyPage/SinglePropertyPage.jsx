import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { propertyDelete } from 'core/api/properties/methodDefinitions';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import ProProperty from 'core/components/ProProperty';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';
import PageApp from '../../components/PageApp';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import SinglePropertyPageForms from './SinglePropertyPageForms';
import SinglePropertyPageTitle from './SinglePropertyPageTitle';

const SinglePropertyPage = props => {
  const history = useHistory();
  const { loan, propertyId, currentUser } = props;
  const { loans } = currentUser || {};
  const { borrowers, properties, _id: loanId } = loan;
  const property = properties.find(({ _id }) => _id === propertyId);

  if (!property) {
    // Do this when deleting the property, so it doesn't display a giant error
    // before routing to the properties page
    return null;
  }

  if (property.category === PROPERTY_CATEGORY.PRO) {
    return <ProProperty property={property} loan={loan} />;
  }

  const { address1, address, zipCode, city } = property;

  const title = address || <T id="SinglePropertyPage.title" />;

  return (
    <PageApp
      id="SinglePropertyPage"
      title={<SinglePropertyPageTitle loan={loan} property={property} />}
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
              history.push(
                createRoute(APP_ROUTES.PROPERTIES_PAGE.path, {
                  ':loanId': loan._id,
                }),
              ),
            )
          }
          label={<T id="general.delete" />}
        >
          {loans?.length > 1 && (
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

export default withMatchParam('propertyId')(SinglePropertyPage);
