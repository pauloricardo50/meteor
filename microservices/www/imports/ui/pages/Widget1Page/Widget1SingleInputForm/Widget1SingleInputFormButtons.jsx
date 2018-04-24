import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

const Widget1SingleInputFormButtons = ({ disableSubmit, onDoNotKnow }) => (
  <div className="buttons">
    <Button
      color="primary"
      type="submit"
      variant="raised"
      disabled={disableSubmit}
    >
      Entrer
    </Button>
    <Button onClick={onDoNotKnow} variant="raised" className="button">
      Je ne sais pas
    </Button>
  </div>
);

Widget1SingleInputFormButtons.propTypes = {
  disableSubmit: PropTypes.bool.isRequired,
  onDoNotKnow: PropTypes.func.isRequired,
};

export default Widget1SingleInputFormButtons;
