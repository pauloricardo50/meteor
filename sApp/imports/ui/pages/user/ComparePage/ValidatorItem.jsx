import React from 'react';
import PropTypes from 'prop-types';

import Icon from '/imports/ui/components/general/Icon';

import { T } from 'core/components/Translation';

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
        <Icon type="check" className="success" />
        <T id="ValidatorItem.isValid" />
      </div>
    );
  }

  return (
    <div style={styles.div}>
      <Icon type="close" className={errorClass} />
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
