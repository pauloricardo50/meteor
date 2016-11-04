import React from 'react';

const styles = {
  ul: {
    listStyle: 'none',
    textDecoration: 'none',
    paddingTop: 150,
  },
  li: {
    display: 'inline-block',
    padding: 20,
  },
  copyright: {
    padding: 20,
  },
};

export default class HomeFooter extends React.Component {
  render() {
    return (
      <section className="col-xs-12">
        <ul style={styles.ul} className="text-center">
          <li style={styles.li}><a><h4 className="secondary bold">A propos</h4></a></li>
          <li style={styles.li}><a><h4 className="secondary bold">Carrières</h4></a></li>
          <li style={styles.li}><a><h4 className="secondary bold">Conditions d'utilisation</h4></a></li>
        </ul>
        <br />
        <p className="text-center secondary bold" style={styles.copyright}>e-Potek © 2016</p>
      </section>
    );
  }
}
