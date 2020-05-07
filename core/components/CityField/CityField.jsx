import { Meteor } from 'meteor/meteor';

import React, { useEffect, useState } from 'react';
import { withProps } from 'recompose';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { borrowerUpdate } from '../../api/borrowers/methodDefinitions';
import { getCitiesFromZipCode } from '../../api/gpsStats/methodDefinitions';
import AutoFormSelectFieldInput from '../AutoForm/AutoFormSelectFieldInput';
import T from '../Translation';

const getCities = async zipCode => {
  if (zipCode) {
    try {
      const cities = await getCitiesFromZipCode.run({ zipCode });
      return cities;
    } catch (error) {
      return [];
    }
  }

  return [];
};

const CityField = ({ updateFunc, cities, city }) => (
  <AutoFormSelectFieldInput
    InputProps={{
      defaultValue: city,
      label: <T id="Forms.city" />,
      style: { width: '100%', maxWidth: '400px' },
      readOnly: false,
      required: true,
      todo: !city,
      multiline: true,
      id: 'city',
      options: cities.map(c => ({ id: c })),
      transform: c => c,
    }}
    saveOnChange
    showValidIconOnChange
    updateFunc={updateFunc}
  />
);

export default withProps(({ doc }) => {
  const [cities, setCities] = useState([]);
  const { _collection, zipCode, city } = doc;

  useEffect(() => {
    getCities(zipCode).then(setCities);
  }, [zipCode]);

  let updateFunc = () => Promise.resolve();

  switch (_collection) {
    case BORROWERS_COLLECTION:
      updateFunc = ({ object: { city: newCity } = {} }) =>
        borrowerUpdate.run({
          borrowerId: doc._id,
          object: { city: newCity },
        });
      break;
    default: {
      throw new Meteor.Error(
        `Collection ${_collection} not allowed in CityField`,
      );
    }
  }

  return {
    cities,
    updateFunc,
    city,
  };
})(CityField);
