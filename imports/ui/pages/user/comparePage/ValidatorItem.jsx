import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  div: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
};

const ValidatorItem = ({ isValid, error, errorClass }) => {
  if (isValid) {
    return (
      <div style={styles.div}>
        <CheckIcon className="success" />
        <T id="ValidatorItem.isValid" />
      </div>
    );
  }

  return (
    <div style={styles.div}>
      <CloseIcon className={errorClass} />
      <T id={`ValidatorItem.error.${error}`} />
    </div>
  );
};

ValidatorItem.propTypes = {
  isValid: PropTypes.bool.isRequired,
  error: PropTypes.string,
  errorClass: PropTypes.string,
};

ValidatorItem.defaultProps = {
  error: '',
  errorClass: '',
};

export default ValidatorItem;
