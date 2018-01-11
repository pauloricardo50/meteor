import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import cleanMethod from 'core/api/cleanMethods';

import Checkbox from '/imports/ui/components/general/Checkbox';

const handleCheck = (
  { updateFunc, docId, inputProps: { id } },
  isInputChecked,
) => {
  const object = {};
  object[`adminValidation.${id}`] = isInputChecked;
  cleanMethod(updateFunc, { object, id: docId });
};

const styles = {
  div: {
    position: 'absolute',
    top: '0px',
    right: '0px',
  },
  wrapper: {
    position: 'relative',
    right: '-100%',
  },
};

const FormValidator = (props) => {
  const { admin, doc, inputProps: id } = props;
  if (!admin) {
    return null;
  }

  const checked = !!get(doc.adminValidation, id);
  return (
    <div style={styles.div}>
      <div style={styles.wrapper}>
        <Checkbox
          label={checked ? 'Validé' : 'Valider'}
          value={checked}
          onChange={(e, c) => handleCheck(props, c)}
        />
      </div>
    </div>
  );
};

FormValidator.propTypes = {
  admin: PropTypes.bool,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};

FormValidator.defaultProps = {
  admin: false,
};

export default FormValidator;
