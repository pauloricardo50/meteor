import React from 'react';
import PropTypes from 'prop-types';

import renderObject from 'core/utils/renderObject';
import Button from 'core/components/Button';
import { withState } from 'recompose';

const LoanObject = ({ showObject, setShowObject, loan }) => (
  <React.Fragment>
    <div className="text-center">
      <Button
        raised
        label={showObject ? 'Masquer' : 'Afficher détails'}
        onClick={() => setShowObject(!showObject)}
      />
    </div>
    {showObject && (
      <ul className="loan-map">
        {Object.keys(loan).map(key => renderObject(key, loan))}
      </ul>
    )}
  </React.Fragment>
);

LoanObject.propTypes = {
  showObject: PropTypes.bool.isRequired,
  setShowObject: PropTypes.func.isRequired,
  loan: PropTypes.object.isRequired,
};

export default withState('showObject', 'setShowObject', false)(LoanObject);
