import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import Button from 'core/components/Button';
import renderObject from 'core/utils/renderObject';

const LoanObject = ({ showObject, setShowObject, loan }) => (
  <>
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
  </>
);

LoanObject.propTypes = {
  loan: PropTypes.object.isRequired,
  setShowObject: PropTypes.func.isRequired,
  showObject: PropTypes.bool.isRequired,
};

export default withState('showObject', 'setShowObject', false)(LoanObject);
