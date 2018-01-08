import React from 'react';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

import HomeDev from './HomeDev';

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
    <h1>
      <T id="NewUserOptions.title" />
    </h1>
    <h3 style={styles.h3}>
      <T id="NewUserOptions.description" />
    </h3>
    <Button
      raised
      label={<T id="HomePage.CTA.buy" />}
      link
      to="/start1/acquisition"
      primary
      style={styles.button}
    />
    <HomeDev style={styles.button} primary />
  </section>
);

export default NewUserOptions;

NewUserOptions.propTypes = {};
