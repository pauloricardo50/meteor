import React from 'react';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';

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

const NewUserOptions = () =>
  <section className="text-center new-user">
    <h1><T id="NewUserOptions.title" /></h1>
    <h3 style={styles.h3}><T id="NewUserOptions.description" /></h3>
    {/* <RaisedButton
      label="Prenez le test"
      primary
      containerElement={<Link to="/start1/test" />}
      style={styles.button}
    /> */}
    <RaisedButton
      label={<T id="HomePage.CTA1" />}
      containerElement={<Link to="/start1/acquisition" />}
      primary
      style={styles.button}
    />
    <HomeDev style={styles.button} primary />
  </section>;

export default NewUserOptions;

NewUserOptions.propTypes = {};
