import PropTypes from 'prop-types';
import React from 'react';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';
import { propertyPercent, filesPercent } from '/imports/js/arrays/steps';
import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';
import { requestFiles } from '/imports/js/arrays/files';

import { isDemo } from '/imports/js/helpers/browserFunctions';
import FakePropertyCompleter from '/imports/ui/components/general/FakePropertyCompleter.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

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

const PropertyPage = props => {
  const percent =
    (propertyPercent(props.loanRequest, props.borrowers) +
      filesPercent(props.loanRequest, requestFiles, 'auction')) /
    2;

  return (
    <ProcessPage {...props} stepNb={1} id="property">
      <section className="mask1 property-page">
        <h1 className="text-center">
          <T id="PropertyPage.title" values={{ count: props.borrowers.length }} />
          <br />
          <small className={percent >= 1 && 'success'}>
            <T id="PropertyPage.progress" values={{ value: percent }} />
            {' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h1>

        <div className="description">
          <p><T id="Forms.mandatory" /></p>
        </div>

        <DropzoneArray
          array={requestFiles(props.borrower).auction}
          documentId={props.loanRequest._id}
          pushFunc="pushRequestValue"
          updateFunc="pushRequestValue"
          collection="loanRequests"
          filesObject={props.loanRequest.files}
          filesObjectSelector="files"
        />

        <AutoForm
          inputs={PropertyFormArray(props.loanRequest, props.borrowers)}
          documentId={props.loanRequest._id}
          updateFunc="updateRequest"
          pushFunc="pushRequestValue"
          popFunc="popRequestValue"
          doc={props.loanRequest}
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
