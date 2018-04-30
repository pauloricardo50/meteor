import React from 'react';
import PropTypes from 'prop-types';

import Title from './Title';

const UploaderTop = props => <Title {...props} />;

UploaderTop.propTypes = {
  currentValue: PropTypes.arrayOf(PropTypes.object),
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  isOwnedByAdmin: PropTypes.bool.isRequired,
  removeDocument: PropTypes.func.isRequired,
};

UploaderTop.defaultProps = {
  currentValue: [],
};

export default UploaderTop;
