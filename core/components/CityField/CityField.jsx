import React, { useEffect, useState } from 'react';
import { withProps } from 'recompose';

import { getCitiesFromZipCode } from '../../api/gpsStats/methodDefinitions';
import AutoFormSelectFieldInput from '../AutoForm/AutoFormSelectFieldInput';
import AutoFormTextInput from '../AutoForm/AutoFormTextInput';
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

const CityField = ({
  updateFunc,
  cities,
  city,
  customCity,
  setCustomCity,
  selectValue,
}) => (
  <>
    <AutoFormSelectFieldInput
      InputProps={{
        currentValue: selectValue,
        label: <T id="Forms.city" />,
        style: { width: '100%', maxWidth: '400px' },
        readOnly: false,
        required: true,
        todo: !city,
        multiline: true,
        id: 'city',
        options: cities,
        transform: c => {
          if (c === 'other') {
            return <T id="general.other" />;
          }
          return c || 'Aucun résultat trouvé';
        },
      }}
      saveOnChange
      showValidIconOnChange
      updateFunc={value => {
        const {
          object: { city: newCity },
        } = value;

        if (newCity === 'other') {
          setCustomCity(true);
          return Promise.resolve();
        }

        setCustomCity(false);
        return updateFunc(value);
      }}
    />
    {customCity && (
      <AutoFormTextInput
        InputProps={{
          currentValue: city,
          label: <T id="Forms.city.specify" />,
          style: { width: '100%', maxWidth: '400px' },
          readOnly: false,
          required: true,
          todo: !city,
          id: 'city',
        }}
        saveOnChange
        updateFunc={updateFunc}
      />
    )}
  </>
);

export default withProps(({ doc, updateFunc }) => {
  const [cities, setCities] = useState([]);
  const [customCity, setCustomCity] = useState(false);
  const { _id: docId, zipCode, city } = doc;

  useEffect(() => {
    getCities(zipCode).then(result => {
      setCities([...result, { id: 'other' }]);
      if (city && !result.includes(city)) {
        setCustomCity(true);
      }
    });
  }, [zipCode]);

  const isRecommendedCity = city && cities.length > 0 && cities.includes(city);

  return {
    cities,
    updateFunc: ({ object }) => updateFunc({ id: docId, object }),
    city,
    customCity,
    setCustomCity,
    selectValue: isRecommendedCity ? city : city ? 'other' : undefined,
  };
})(CityField);
