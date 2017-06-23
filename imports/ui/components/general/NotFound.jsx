import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  section: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    marginBottom: 0,
  },
  button: {
    marginTop: 40,
  },
};

const NotFound = () => {
  return (
    <section style={styles.section}>
      <h1 style={styles.h1}><T id="NotFound.title" /></h1>
      <h3 className="secondary"><T id="NotFound.description" /></h3>
      <div style={styles.button}>
        <RaisedButton
          primary
          label={<T id="NotFound.button" />}
          containerElement={<Link to="/home" />}
        />
      </div>
    </section>
  );
};

export default NotFound;
