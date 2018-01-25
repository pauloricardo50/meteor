import PropTypes from 'prop-types';
import React from 'react';

import ProcessPage from '/imports/ui/components/ProcessPage';
import AutoForm from 'core/components/AutoForm';
import {
  getPropertyArray,
  getPropertyRequestArray,
} from 'core/arrays/PropertyFormArray';
import UploaderArray from 'core/components/UploaderArray';
import { requestFiles, propertyFiles } from 'core/api/files/files';
import {
  disableForms,
  getPropertyCompletion,
} from 'core/utils/requestFunctions';

import { isDemo } from 'core/utils/browserFunctions';
import FakePropertyCompleter from '/imports/ui/components/FakePropertyCompleter';
import { T } from 'core/components/Translation';
import withRequest from 'core/containers/withRequest';

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
  const { loanRequest, borrowers, property } = props;
  const percent = getPropertyCompletion({ loanRequest, borrowers, property });

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
          fileArray={requestFiles(loanRequest).auction}
          doc={loanRequest}
          collection="loanRequests"
          disabled={disableForms({ loanRequest })}
        />
        <UploaderArray
          fileArray={propertyFiles(property, loanRequest).auction}
          doc={property}
          collection="properties"
          disabled={disableForms({ loanRequest })}
        />

        <AutoForm
          inputs={getPropertyRequestArray({ loanRequest, borrowers })}
          docId={loanRequest._id}
          updateFunc="updateRequest"
          pushFunc="pushRequestValue"
          popFunc="popRequestValue"
          doc={loanRequest}
          disabled={disableForms({ loanRequest })}
        />

        <AutoForm
          inputs={getPropertyArray({ loanRequest, borrowers, property })}
          docId={property._id}
          updateFunc="updateProperty"
          pushFunc="pushPropertyValue"
          popFunc="popPropertyValue"
          doc={property}
          disabled={disableForms({ loanRequest })}
        />

        {isDemo() && <FakePropertyCompleter loanRequest={loanRequest} />}
      </section>
    </ProcessPage>
  );
};

PropertyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRequest(PropertyPage);
