import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import PropertyFormArray from '/imports/js/arrays/PropertyFormArray';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  bottomButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
};

const PropertyPage = props => (
  <div style={styles.div}>
    <RaisedButton
      label="Ok"
      containerElement={<Link to="/app" />}
      primary
      style={styles.topButton}
    />

    <section className="mask1">
      <h1>
        {props.borrowers.length > 1
          ? 'Notre bien immobilier'
          : 'Mon bien immobilier'}
      </h1>

      <AutoForm
        inputs={PropertyFormArray(props)}
        formClasses="col-sm-10 col-sm-offset-1"
        loanRequest={props.loanRequest}
        borrowers={props.borrowers}
        documentId={props.loanRequest._id}
        updateFunc="updateRequest"
        pushFunc="pushRequestValue"
        popFunc="popRequestValue"
      />
    </section>

    <RaisedButton
      label="Ok"
      containerElement={<Link to="/app" />}
      primary
      style={styles.bottomButton}
    />
  </div>
);

PropertyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PropertyPage;
