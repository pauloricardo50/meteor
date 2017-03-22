import React from 'react';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';

import HomeDev from './HomeDev.jsx';

const styles = {
  h3: {
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 40,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

const NewUserOptions = () => (
  <section className="text-center new-user">
    <h1>Ça à l'air bien vide!</h1>
    <h3 style={styles.h3}>
      Vous pourrez monter votre dossier, lancer les enchères,
      et conclure votre demande de prêt depuis ici.
    </h3>
    <RaisedButton
      label="Prenez le test"
      primary
      containerElement={<Link to="/start1/test" />}
      style={styles.button}
    />
    <RaisedButton
      label="Faire une acquisition"
      containerElement={<Link to="/start1/acquisition" />}
      primary
      style={styles.button}
    />
    <HomeDev style={styles.button} primary />
  </section>
);

export default NewUserOptions;

NewUserOptions.propTypes = {};
