import React from 'react';
import PropTypes from 'prop-types';

// import T from '../Translation';
import Button from '../Button';
import DevError from './DevError';

// Don't user Translation here, because Loadable depends on it...
// Find another solution once we really need this to be translated
const LayoutError = ({ style, error }) => (
  <div className="flex-col center animated jackInTheBox" style={style}>
    <h2 className="error">Woops une erreur!</h2>
    <div className="description">
      <p>
        Quelque chose n'a pas fonctionné comme prévu, on en est déjà informés,
        et vous pouvez essayer de recharger la page.
        <br />
        Si ça ne résoud pas le problème, écrivez-nous à digital@e-potek.ch.
      </p>
    </div>
    <DevError error={error} />
    <div className="flex center">
      <Button raised color="primary" onClick={() => location.reload()}>
        Recharger la page
      </Button>
      <a href="/" className="home-link">
        <Button raised color="secondary">
          Page d'accueil
        </Button>
      </a>
    </div>
  </div>
);

LayoutError.propTypes = {
  error: PropTypes.object.isRequired,
  style: PropTypes.object,
};

LayoutError.defaultProps = {
  style: {},
};

export default LayoutError;
