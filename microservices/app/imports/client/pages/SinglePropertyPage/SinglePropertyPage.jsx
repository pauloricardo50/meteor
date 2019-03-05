import PropTypes from 'prop-types';
import React from 'react';
import { Element } from 'react-scroll';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import AutoForm from 'core/components/AutoForm';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import T from 'core/components/Translation';
import {
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  VALUATION_STATUS,
} from 'core/api/constants';
import withMatchParam from 'core/containers/withMatchParam';
import Valuation from 'core/components/Valuation';
import ConfirmMethod from 'core/components/ConfirmMethod';
import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import { propertyDelete } from 'core/api/methods/index';
import { createRoute } from 'core/utils/routerUtils';
import Page from 'core/components/Page';
import { PROPERTIES_PAGE } from '../../../startup/client/appRoutes';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import SinglePropertyPageTitle from './SinglePropertyPageTitle';
import LaunchValuationButton from './LaunchValuationButton';

const shouldDisplayLaunchValuationButton = ({ progress, status }) =>
  progress >= 1 && status !== VALUATION_STATUS.DONE;

const SinglePropertyPage = (props) => {
  const { loan, propertyId, history } = props;
  const { borrowers, properties, residenceType, _id: loanId } = loan;
  const property = properties.find(({ _id }) => _id === propertyId);

  if (!property) {
    // Do this when deleting the property, so it doesn't display a giant error
    // before routing to the properties page
    return null;
  }

  const { address1, zipCode, city, mortgageNotes } = property;
  const { userFormsEnabled } = loan;
  const progress = PropertyCalculator.propertyPercent({
    property,
    loan,
  });
  const hasMultipleProperties = properties.length > 1;

  const title = address1 || <T id="SinglePropertyPage.title" />;

  return (
    <Page
      id="SinglePropertyPage"
      title={<SinglePropertyPageTitle loan={loan} property={property} />}
    >
      <section className="card1 card-top property-page">
        <h1 className="text-center">{title}</h1>

        {hasMultipleProperties && (
          <ConfirmMethod
            buttonProps={{
              error: true,
              outlined: true,
              className: 'property-deleter',
            }}
            method={() =>
              propertyDelete
                .run({ propertyId, loanId })
                .then(() =>
                  history.push(createRoute(PROPERTIES_PAGE, { ':loanId': loan._id })))
            }
            label={<T id="general.delete" />}
          />
        )}

        <MapWithMarkerWrapper
          address1={address1}
          city={city}
          zipCode={zipCode}
          options={{ zoom: 15 }}
        />
        {/* <Element name="valuation" className="valuation">
          <Valuation property={property} loanResidenceType={residenceType} />
        </Element> */}

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form user-form__info"
            inputs={getPropertyLoanArray({ loan, borrowers })}
            collection={LOANS_COLLECTION}
            doc={loan}
            docId={loan._id}
            disabled={!userFormsEnabled}
          />
        </div>

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form user-form__info"
            inputs={getPropertyArray({ loan, borrowers, property })}
            collection={PROPERTIES_COLLECTION}
            doc={property}
            docId={property._id}
            disabled={!userFormsEnabled}
          />
        </div>
        <div className="flex--helper flex-justify--center">
          <MortgageNotesForm
            propertyId={propertyId}
            mortgageNotes={mortgageNotes}
          />
        </div>
      </section>
      <div className="single-property-page-buttons">
        <ReturnToDashboard />
        {/* <LaunchValuationButton
          enabled={shouldDisplayLaunchValuationButton({
            progress,
            status: property.valuation.status,
          })}
        /> */}
      </div>
    </Page>
  );
};

SinglePropertyPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(
  withMatchParam('propertyId'),
  withRouter,
)(SinglePropertyPage);
