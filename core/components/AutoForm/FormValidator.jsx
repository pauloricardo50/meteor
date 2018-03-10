import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Checkbox from 'core/components/Checkbox';

const handleCheck = (
  { updateFunc, docId, inputProps: { id } },
  isInputChecked,
) => {
  const object = { [`adminValidation.${id}`]: isInputChecked };
  updateFunc({ object, id: docId });
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
  let id;
  const { admin, doc, inputProps } = props;
  if (!admin) {
    return null;
  }

  if (!inputProps) {
    id = props.id;
  } else {
    id = inputProps.id;
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
