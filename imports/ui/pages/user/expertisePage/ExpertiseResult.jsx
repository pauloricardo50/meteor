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
  },
  title: {
    padding: '36px 0',
    borderTop: `1px solid ${colors.lightBorder}`,
    borderBottom: `1px solid ${colors.lightBorder}`,
  },
  button: {
    margin: 8,
  },
};

const results = {
  high: {
    title: (
      <span>
        <span className="fa fa-times" />
        {' '}
        La valeur du bien est au dessus du marché
      </span>
    ),
    titleClass: 'warning',
    description: 'Asdf',
    actions: [
      <RaisedButton label="Ajuster ma demande" primary style={styles.button} />,
      <RaisedButton
        label="Continuer quand même"
        style={styles.button}
        containerElement={<Link to="/app" />}
      />,
    ],
  },
  low: {
    title: (
      <span>
        <span className="fa fa-times" />
        {' '}
        La valeur du bien est en dessous du marché
      </span>
    ),
    titleClass: 'warning',
    description: 'Asdf',
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
    title: (
      <span>
        <span className="fa fa-check" />
        {' '}
        La valeur du bien est dans la fourchette des prix du marché{' '}
      </span>
    ),
    titleClass: 'success',
    description: 'Asdf',
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
        <h1 className={object.titleClass} style={styles.title}>
          {object.title}
        </h1>
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
