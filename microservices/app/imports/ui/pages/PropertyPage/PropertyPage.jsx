import PropTypes from 'prop-types';
import React from 'react';

import ProcessPage from '/imports/ui/components/ProcessPage';
import AutoForm from 'core/components/AutoForm';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import UploaderArray from 'core/components/UploaderArray';
import { loanFiles, propertyFiles } from 'core/api/files/files';
import { disableForms, getPropertyCompletion } from 'core/utils/loanFunctions';

import { isDemo } from 'core/utils/browserFunctions';
import FakePropertyCompleter from '/imports/ui/components/FakePropertyCompleter';
import { T } from 'core/components/Translation';
import withLoan from 'core/containers/withLoan';

const styles = {
  topDiv: {
    display: 'inline-block',
    width: '100%',
    marginBottom: 20,
  },
  bottomDiv: {
    display: 'inline-block',
    width: '100%',
    marginTop: 20,
  },
  topRightButton: {
    float: 'right',
  },
};

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
          fileArray={loanFiles(loan).auction}
          doc={loan}
          collection="loans"
          disabled={disableForms({ loan })}
        />
        <UploaderArray
          fileArray={propertyFiles(property, loan).auction}
          doc={property}
          collection="properties"
          disabled={disableForms({ loan })}
        />

        <AutoForm
          inputs={getPropertyLoanArray({ loan, borrowers })}
          docId={loan._id}
          updateFunc="updateLoan"
          pushFunc="pushLoanValue"
          popFunc="popLoanValue"
          doc={loan}
          disabled={disableForms({ loan })}
        />

        <AutoForm
          inputs={getPropertyArray({ loan, borrowers, property })}
          docId={property._id}
          updateFunc="updateProperty"
          pushFunc="pushPropertyValue"
          popFunc="popPropertyValue"
          doc={property}
          disabled={disableForms({ loan })}
        />

        {isDemo() && <FakePropertyCompleter loan={loan} />}
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
