import PropTypes from 'prop-types';
import React from 'react';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';
import { propertyPercent } from '/imports/js/arrays/steps';

import { isDemo } from '/imports/js/helpers/browserFunctions';
import FakePropertyCompleter from '/imports/ui/components/general/FakePropertyCompleter.jsx';

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
  const percent = propertyPercent(props.loanRequest, props.borrowers);
  return (
    <ProcessPage {...props} stepNb={0} id="property">
      <section className="mask1 property-page">
        <h1 className="text-center">
          {props.borrowers.length > 1 ? 'Notre bien immobilier' : 'Mon bien immobilier'}
          <br />
          <small className={percent >= 1 && 'success'}>
            Progrès: {Math.round(percent * 1000) / 10}%
            {' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h1>

        <div className="description">
          <p>Les champs marqués avec un * sont obligatoires.</p>
        </div>

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
