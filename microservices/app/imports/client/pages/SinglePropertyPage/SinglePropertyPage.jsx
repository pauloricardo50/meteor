import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import UploaderArray from 'core/components/UploaderArray';
import { loanDocuments, propertyDocuments } from 'core/api/files/documents';
import { getPropertyCompletion } from 'core/utils/loanFunctions';
import T from 'core/components/Translation';
import { LOANS_COLLECTION, PROPERTIES_COLLECTION } from 'core/api/constants';
import withMatchParam from 'core/containers/withMatchParam';
import Valuation from 'core/components/Valuation'
import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import Page from '../../components/Page';

const SinglePropertyPage = (props) => {
  const { loan, propertyId } = props;
  const { borrowers, properties } = loan;
  const property = properties.find(({ _id }) => _id === propertyId);
  const { address1, zipCode, city } = property;
  const { userFormsEnabled } = loan;
  const percent = getPropertyCompletion({ loan, borrowers, property });

  const title = address1 || <T id="SinglePropertyPage.title"></T>;

  return (
    <Page id="SinglePropertyPage" title={title}>
      <section className="mask1 property-page">
        <h1 className="text-center">
          {title}
          <br />
          <small className={percent >= 1 && 'success'}>
            <T id="PropertiesPage.progress" values={{ value: percent }} />
            {' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h1>

        <MapWithMarkerWrapper
          address1={address1}
          city={city}
          zipCode={zipCode}
          options={{ zoom: 14 }}
        />

        <div className="description">
          <p>
            <T id="PropertiesPage.description" />
          </p>
        </div>

        <Valuation property={property} />


        <div className="description">
          <p>
            <T id="Forms.mandatory" />
          </p>
        </div>

        <UploaderArray
          documentArray={loanDocuments(loan).auction}
          doc={loan}
          collection={LOANS_COLLECTION}
          disabled={!userFormsEnabled}
        />

        <UploaderArray
          documentArray={propertyDocuments(property, loan).auction}
          doc={property}
          collection={PROPERTIES_COLLECTION}
          disabled={!userFormsEnabled}
        />

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form"
            inputs={getPropertyLoanArray({ loan, borrowers })}
            collection={LOANS_COLLECTION}
            doc={loan}
            docId={loan._id}
            disabled={!userFormsEnabled}
          />
        </div>

        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form"
            inputs={getPropertyArray({ loan, borrowers, property })}
            collection={PROPERTIES_COLLECTION}
            doc={property}
            docId={property._id}
            disabled={!userFormsEnabled}
          />
        </div>
      </section>
    </Page>
  );
};

SinglePropertyPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withMatchParam('propertyId')(SinglePropertyPage);
