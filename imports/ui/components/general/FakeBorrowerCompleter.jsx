import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';

const MergeRecursive = (obj1, obj2) => {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor == Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }

  return obj1;
};

const handleCheat = props => {
  const object = {
    firstName: 'Marie',
    lastName: 'Rochat',
    gender: 'f',
    address1: 'Chemin du Mont 3',
    zipCode: 1200,
    city: 'Genève',
    citizenships: 'Suisse, Français',
    age: 35,
    birthPlace: 'Lausanne',
    civilStatus: 'single',
    company: 'Deloitte',
    personalBank: 'BCGE',
  };

  const finalObject = MergeRecursive(object, props.borrower);

  cleanMethod('updateBorrower', finalObject, props.borrower._id, () =>
    location.reload());
};

const FakeBorrowerCompleter = props => {
  return (
    <div className="text-center" style={{ margin: '20px 0' }}>
      <RaisedButton label="Tricher" onTouchTap={() => handleCheat(props)} />
    </div>
  );
};

FakeBorrowerCompleter.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeBorrowerCompleter;
