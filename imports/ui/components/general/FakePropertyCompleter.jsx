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
    property: {
      address1: 'Rue du Succès 18',
      zipCode: 1200,
      city: 'Genève',
      usageType: 'primary',
      type: 'flat',
      futureOwner: 0,
      constructionYear: 2010,
      landArea: 300,
      insideArea: 140,
      volume: 1500,
      volumeNorm: 'SIA',
      roomCount: 5,
      bathroomCount: 2,
      toiletCount: 0,
      parking: {
        box: 0,
        inside: 1,
        outside: 2,
      },
      minergie: true,
      isCoproperty: true,
      copropertyPercentage: 0.400,
      cityPlacementQuality: 2,
      buildingPlacementQuality: 3,
      buildingQuality: 1,
      flatQuality: 2,
      materialsQuality: 2,
      files: {},
    },
  };

  const finalObject = MergeRecursive(object, props.loanRequest);

  cleanMethod('updateRequest', finalObject, props.loanRequest._id, () =>
    location.reload());
};

const FakePropertyCompleter = props => {
  return (
    <div className="text-center" style={{ margin: '20px 0' }}>
      <RaisedButton label="Tricher" onTouchTap={() => handleCheat(props)} />
    </div>
  );
};

FakePropertyCompleter.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakePropertyCompleter;
