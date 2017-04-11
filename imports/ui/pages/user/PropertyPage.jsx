import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';
import FakePropertyCompleter
  from '/imports/ui/components/general/FakePropertyCompleter.jsx';

import { propertyPercent } from '/imports/js/arrays/steps';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
};

const PropertyPage = props => (
  <div style={styles.div}>
    <RaisedButton
      label="Retour"
      containerElement={<Link to="/app" />}
      style={styles.topButton}
    />

    <section className="mask1 property-page">
      <h1 className="text-center">
        {props.borrowers.length > 1
          ? 'Notre bien immobilier'
          : 'Mon bien immobilier'}
        <br />
        <small>
          Progrès:
          {' '}
          {Math.round(
            propertyPercent(props.loanRequest, props.borrowers) * 1000,
          ) / 10}
          %
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
      />

      {propertyPercent(props.loanRequest, props.borrowers) < 1 &&
        <FakePropertyCompleter loanRequest={props.loanRequest} />}
    </section>
  </div>
);

PropertyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PropertyPage;
