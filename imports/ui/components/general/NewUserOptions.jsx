import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  h3: {
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 40,
  },
};

const NewUserOptions = () => (
  <section className="text-center">
    <h1>Ça à l&apos;air bien vide!</h1>
    <h3 style={styles.h3}>
      Vous pourrez monter votre dossier, lancer les enchères,
      et conclure votre demande de prêt depuis ici.
    </h3>
    <RaisedButton
      label="Testez votre éligibilité"
      primary
      href="/start"
    />
  </section>
);

export default NewUserOptions;

NewUserOptions.propTypes = {};
