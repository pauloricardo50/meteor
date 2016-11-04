import React from 'react';
import { Accounts } from 'meteor/std:accounts-ui';

const styles = {
  section: {
    paddingTop: 100,
    display: 'table',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'scroll',
    backgroundRepeat: 'no-repeat no-repeat',
    backgroundSize: 'cover',
  },
  div1: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  div2: {
    margin: 'auto',
    display: 'block',
    maxWidth: 500,
  },
};

export default class LoginPage extends React.Component {
  render() {
    return (
      <section style={styles.section}>
        <div style={styles.div1}>
          <div style={styles.div2}>
            <Accounts.ui.LoginForm />
          </div>
        </div>
      </section>
    );
  }
}
