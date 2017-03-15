import React from 'react';
import { Accounts } from 'meteor/std:accounts-ui';
import { DocHead } from 'meteor/kadira:dochead';

const styles = {
  section: {
    paddingTop: 100,
    display: 'table',
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 64px)',
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
    paddingLeft: 16,
    paddingRight: 16,
  },
};

export default class LoginPage extends React.Component {
  componentDidMount() {
    DocHead.setTitle('Login - e-Potek');
  }

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
