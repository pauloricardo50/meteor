import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

const styles = {
  buttonDiv: {
    margin: '20px 0',
  },
  button: {
    margin: 8,
  },
};

const LenderPickerStart = props => {
  return (
    <article>
      <div className="description">
        <p>
          Il est enfin temps de choisir votre prêteur. Vous aurez à faire une série de choix importants concernant votre hypothèque. Vous pourrez les modifier plusieurs fois et voir comment cela affecte le coût mensuel.
          <br /><br />
          Si vous ne maitrisez pas très bien le domaine, nous vous recommandons vivement d'appeler votre conseiller e-Potek pour faire cette étape ensemble.
        </p>
      </div>
      <div className="text-center" style={styles.buttonDiv}>
        <RaisedButton label="Appeler mon conseiller" primary style={styles.button} />
        <RaisedButton
          label="Continuer"
          style={styles.button}
          onTouchTap={() => props.setFormState('initialContinue', true, () => props.scroll('1'))}
        />
      </div>
    </article>
  );
};

LenderPickerStart.propTypes = {
  scroll: PropTypes.func.isRequired,
};

export default LenderPickerStart;
