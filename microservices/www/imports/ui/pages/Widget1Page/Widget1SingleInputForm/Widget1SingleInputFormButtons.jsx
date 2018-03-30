import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

const Widget1SingleInputFormButtons = ({ onClick, disableEnter }) => (
  <div className="buttons">
    <Button
      color="primary"
      type="submit"
      onClick={onClick}
      variant="raised"
      disabled={disableEnter}
    >
      Entrer
    </Button>
    <Button onClick={onClick} variant="raised" className="button">
      Je ne sais pas
    </Button>
  </div>
);

Widget1SingleInputFormButtons.propTypes = {};

export default Widget1SingleInputFormButtons;
