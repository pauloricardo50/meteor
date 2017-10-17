import React from 'react';
import PropTypes from 'prop-types';

import partition from 'lodash/partition';

import Toggle from '/imports/ui/components/general/Material/Toggle';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const styles = {
  toggles: {
    width: '100%',
    maxWidth: 250,
  },
};

const FieldToggles = ({
  allFields,
  hiddenFields,
  toggleField,
  removeCustomField,
}) => {
  const [defaultFields, customFields] = partition(
    allFields,
    field => field.id.indexOf('custom') < 0,
  );

  return (
    <div className="flex-col center">
      <h3>
        <T id="FieldToggles.defaultFields" />
      </h3>

      <div className="flex-col" style={styles.toggles}>
        {defaultFields
          .filter(field => field.id !== 'name')
          .map(field => (
            <Toggle
              key={field.id}
              label={<T id={`Comparator.${field.id}`} />}
              toggled={hiddenFields.indexOf(field.id) < 0}
              onToggle={() => toggleField(field.id)}
            />
          ))}
      </div>

      <h3>
        <T id="FieldToggles.customFields" />
      </h3>

      {customFields.length ? (
        <div className="flex-col" style={styles.toggles}>
          {customFields.map(field => (
            <div
              style={{
                position: 'relative',
                height: 38,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={field.id}
              className="flex"
            >
              <Toggle
                label={field.name}
                toggled={hiddenFields.indexOf(field.id) < 0}
                onToggle={() => toggleField(field.id)}
                // style={{ width: 'unset' }}
              />
              <Button
                dense
                primary
                label={<T id="general.delete" />}
                onClick={() => removeCustomField(field.id)}
                // style={{ position: 'absolute', left: '100%', top: 0 }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="description">
          <p>
            <T id="FieldToggles.noCustomFields" />
          </p>
        </div>
      )}
    </div>
  );
};

FieldToggles.propTypes = {
  allFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  hiddenFields: PropTypes.array.isRequired,
  toggleField: PropTypes.func.isRequired,
};

export default FieldToggles;
