import { Meteor } from 'meteor/meteor';

import React, { useEffect, useState } from 'react';
import { withProps } from 'recompose';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { borrowerUpdate } from '../../api/borrowers/methodDefinitions';
import { getCitiesFromZipCode } from '../../api/gpsStats/methodDefinitions';
import { propertyUpdate } from '../../api/properties/methodDefinitions';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';
import AutoFormSelectFieldInput from '../AutoForm/AutoFormSelectFieldInput';
import T from '../Translation';

const getCities = async (zipCode = '') => {
  if (String(zipCode).length === 4) {
    try {
      const cities = await getCitiesFromZipCode.run({ zipCode });
      return cities.length
        ? cities.map(city => ({
            id: city,
          }))
        : [{ id: null }];
    } catch (error) {
      return [{ id: null }];
    }
  }

  return [{ id: null }];
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
      options: cities,
      transform: c => c || 'Aucun résultat trouvé',
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
        newCity
          ? borrowerUpdate.run({
              borrowerId: doc._id,
              object: { city: newCity },
            })
          : Promise.resolve();
      break;
    case PROPERTIES_COLLECTION:
      updateFunc = ({ object: { city: newCity } = {} }) =>
        newCity
          ? propertyUpdate.run({
              propertyId: doc._id,
              object: { city: newCity },
            })
          : Promise.resolve();
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
