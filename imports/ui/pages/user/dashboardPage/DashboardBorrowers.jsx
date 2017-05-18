import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

const styles = {
  div: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    // width: '60%',
  },
};

const DashboardBorrowers = props => {
  return (
    <div className="mask1">
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>Emprunteur</h4>
      {props.borrowers.map(b => (
        <div style={styles.div}>
          <span
            className="fa fa-user-circle-o fa-4x"
            style={{ color: '#D8D8D8', marginRight: 16 }}
          />
          <div style={styles.text}>
            <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
              {!!(b.firstName && b.lastName) && `${b.firstName} ${b.lastName}`}
            </h4>
            {b.age && <h4 className="fixed-size secondary no-margin">{b.age} ans</h4>}
          </div>
          <RaisedButton
            label="Compléter"
            containerElement={
              <Link to={`/app/requests/${props.loanRequest._id}/borrowers/${b._id}`} />
            }
          />
        </div>
      ))}
    </div>
  );
};

DashboardBorrowers.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardBorrowers;
