import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from 'core/api/cleanMethods';

import Button from 'core/components/Button';
import { fakeBorrower } from 'core/api/borrowers/fakes';

const MergeRecursive = (obj1, obj2) => {
  for (const p in obj2) {
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

const handleCheat = (props) => {
  const object = fakeBorrower;

  const finalObject = MergeRecursive(object, props.borrower);

  cleanMethod('borrowerUpdate', {
    object: finalObject,
    id: props.borrower._id,
  }).then(() => location.reload());
};

const FakeBorrowerCompleter = props => (
  <div className="text-center" style={{ margin: '20px 0' }}>
    <Button raised label="Tricher" onClick={() => handleCheat(props)} />
  </div>
);

FakeBorrowerCompleter.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeBorrowerCompleter;
