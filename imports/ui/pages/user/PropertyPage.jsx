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
  topLeftButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  topRightButton: {
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
};

const PropertyPage = props => {
  const percent = propertyPercent(props.loanRequest, props.borrowers);
  return (
    <div style={styles.div}>
      <RaisedButton
        label="Retour"
        containerElement={<Link to="/app" />}
        style={styles.topLeftButton}
      />

      <RaisedButton
        label="Ok"
        containerElement={<Link to="/app" />}
        style={styles.topRightButton}
        primary
      />

      <section className="mask1 property-page">
        <h1 className="text-center">
          {props.borrowers.length > 1
            ? 'Notre bien immobilier'
            : 'Mon bien immobilier'}
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
        />

        {propertyPercent(props.loanRequest, props.borrowers) < 1 &&
          <FakePropertyCompleter loanRequest={props.loanRequest} />}
      </section>
    </div>
  );
};

PropertyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PropertyPage;
