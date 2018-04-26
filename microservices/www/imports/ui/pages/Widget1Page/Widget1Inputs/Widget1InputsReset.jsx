import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import Widget1InputsResetContainer from './Widget1InputsResetContainer';

const Widget1InputsReset = ({ onClick }) => (
  <span className="widget1-inputs-reset">
    <IconButton type="loop" tooltip="Reset" onClick={onClick} />
  </span>
);

Widget1InputsReset.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Widget1InputsResetContainer(Widget1InputsReset);
