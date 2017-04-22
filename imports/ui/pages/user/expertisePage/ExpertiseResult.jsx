import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import colors from '/imports/js/config/colors';

const styles = {
  titleDiv: {
    margin: '40px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: '36px 0',
    borderTop: `1px solid ${colors.lightBorder}`,
    borderBottom: `1px solid ${colors.lightBorder}`,
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 16,
  },
  button: {
    margin: 8,
  },
};

const results = {
  high: {
    titleIcon: 'fa fa-times',
    titleText: 'La valeur du bien est au dessus du marché',
    titleClass: 'warning',
    description: (
      <span>
        Malheur! Vous avez peut être oublié un élément important pour la valorisation de votre projet.
        Essayer de négocier avec le vendeur, car le prix ne semble pas correspondre aux standard du marché.
        <br /><br />
        Votre expert e-Potek pourra vous aider à gérer ce genre de discussions et les tourner à votre avantage.
      </span>
    ),
    actions: [
      <RaisedButton label="Appeler un expert" primary style={styles.button} />,
      <RaisedButton label="Retour" style={styles.button} containerElement={<Link to="/app" />} />,
    ],
  },
  low: {
    titleIcon: 'fa fa-money',
    titleText: 'La valeur du bien est en dessous du marché',

    titleClass: 'success',
    description: (
      <span>
        Il semblerait que vous êtes sur une affaire en or, le bien que vous voulez acheter a une valeur plus élevée que ce qu'il vous coûtera.
        <br /><br />
        Nous vous recommandons de ne pas en parler avec le vendeur, qui voudra certainement revisiter le prix de la vente.
      </span>
    ),
    actions: [
      <RaisedButton label="Ajuster ma demande" style={styles.button} />,
      <RaisedButton
        label="Continuer quand même"
        style={styles.button}
        containerElement={<Link to="/app" />}
      />,
    ],
  },
  normal: {
    titleIcon: 'fa fa-check',
    titleText: 'La valeur du bien est dans la fourchette des prix du marché',
    titleClass: 'success',
    description: 'Rien à rajouter, tout est bon dans ce projet!',
    actions: [
      <RaisedButton
        label="Continuer"
        primary
        style={styles.button}
        containerElement={<Link to="/app" />}
      />,
    ],
  },
};

const ExpertiseResult = props => {
  const object = results[props.expertiseResult.result];
  return (
    <article className="animated fadeIn">
      <div style={styles.titleDiv}>
        <h2 className={object.titleClass} style={styles.title}>
          <span className={object.titleIcon} style={styles.titleIcon} />
          <span className="text-center">{object.titleText}</span>
        </h2>
      </div>
      <div className="description"><p>{object.description}</p></div>

      <div className="text-center">{object.actions}</div>
    </article>
  );
};

ExpertiseResult.propTypes = {
  expertiseResult: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ExpertiseResult;
