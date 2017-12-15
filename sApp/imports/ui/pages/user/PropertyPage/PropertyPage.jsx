import PropTypes from 'prop-types';
import React from 'react';

import ProcessPage from '/imports/ui/components/general/ProcessPage';
import AutoForm from '/imports/ui/components/general/AutoForm';
import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';
import UploaderArray from '/imports/ui/components/general/UploaderArray';
import { requestFiles } from '/imports/js/arrays/files';
import {
  disableForms,
  getPropertyCompletion,
} from '/imports/js/helpers/requestFunctions';

import { isDemo } from '/imports/js/helpers/browserFunctions';
import FakePropertyCompleter from '/imports/ui/components/general/FakePropertyCompleter';
import { T } from 'core/components/Translation';

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
  const percent = getPropertyCompletion(props.loanRequest, props.borrowers);

  return (
    <ProcessPage {...props} stepNb={1} id="property">
      <section className="mask1 property-page">
        <h1 className="text-center">
          <T
            id="PropertyPage.title"
            values={{ count: props.borrowers.length }}
          />
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
          fileArray={requestFiles(props.loanRequest).auction}
          doc={props.loanRequest}
          collection="loanRequests"
          disabled={disableForms(props.loanRequest)}
        />

        <AutoForm
          inputs={PropertyFormArray(props.loanRequest, props.borrowers)}
          docId={props.loanRequest._id}
          updateFunc="updateRequest"
          pushFunc="pushRequestValue"
          popFunc="popRequestValue"
          doc={props.loanRequest}
          disabled={disableForms(props.loanRequest)}
        />

        {isDemo() && <FakePropertyCompleter loanRequest={props.loanRequest} />}
      </section>
    </ProcessPage>
  );
};

PropertyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PropertyPage;
