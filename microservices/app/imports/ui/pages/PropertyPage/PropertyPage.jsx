import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import UploaderArray from 'core/components/UploaderArray';
import { loanDocuments, propertyDocuments } from 'core/api/files/documents';
import { disableForms, getPropertyCompletion } from 'core/utils/loanFunctions';
import T from 'core/components/Translation';
import withLoan from 'core/containers/withLoan';
import { LOANS_COLLECTION, PROPERTIES_COLLECTION } from 'core/api/constants';

import ProcessPage from '../../components/ProcessPage';

const PropertyPage = (props) => {
  const { loan, borrowers, property } = props;
  const percent = getPropertyCompletion({ loan, borrowers, property });

  return (
    <ProcessPage {...props} stepNb={1} id="property">
      <section className="mask1 property-page">
        <h1 className="text-center">
          <T id="PropertyPage.title" values={{ count: borrowers.length }} />
          <br />
          <small className={percent >= 1 && 'success'}>
            <T id="PropertyPage.progress" values={{ value: percent }} />{' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h1>

        <div className="description">
          <p>
            <T id="PropertyPage.description" />
          </p>
        </div>

        <div className="description">
          <p>
            <T id="Forms.mandatory" />
          </p>
        </div>

        <UploaderArray
          fileArray={loanDocuments(loan).auction}
          doc={loan}
          collection={LOANS_COLLECTION}
          disabled={disableForms({ loan })}
        />
        <UploaderArray
          fileArray={propertyDocuments(property, loan).auction}
          doc={property}
          collection={PROPERTIES_COLLECTION}
          disabled={disableForms({ loan })}
        />

        <AutoForm
          inputs={getPropertyLoanArray({ loan, borrowers })}
          docId={loan._id}
          collection={LOANS_COLLECTION}
          doc={loan}
          disabled={disableForms({ loan })}
        />

        <AutoForm
          inputs={getPropertyArray({ loan, borrowers, property })}
          docId={property._id}
          collection={PROPERTIES_COLLECTION}
          doc={property}
          disabled={disableForms({ loan })}
        />
      </section>
    </ProcessPage>
  );
};

PropertyPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withLoan(PropertyPage);
