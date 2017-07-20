import PropTypes from 'prop-types';
import React from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button.jsx';
import { fakeProperty } from '/imports/api/loanrequests/fakes';

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
  const object = { property: fakeProperty };

  const finalObject = MergeRecursive(object, props.loanRequest);

  cleanMethod('updateRequest', finalObject, props.loanRequest._id, () =>
    location.reload(),
  );
};

const FakePropertyCompleter = props => {
  return (
    <div className="text-center" style={{ margin: '20px 0' }}>
      <Button raised label="Tricher" onTouchTap={() => handleCheat(props)} />
    </div>
  );
};

FakePropertyCompleter.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakePropertyCompleter;
