import React, { Component } from 'react';

const styles = {
  section: {
    paddingTop: 100,
  },
  article: {
    textDecoration: 'none',
    paddingTop: 50,
    paddingBottom: 50,
  },
  li: {
    display: 'inline-block',
    padding: 20,
  },
  copyright: {
    padding: 20,
  },
};

export default class HomeFooter extends Component {
  render() {
    return (
      <section className="col-xs-12 text-center" style={styles.section}>
        <hr />
        <article style={styles.article}>
          <a className="col-md-2 col-md-offset-3"><h4 className="secondary bold">A propos</h4></a>
          <a className="col-md-2"><h4 className="secondary bold">Carrières</h4></a>
          <a className="col-md-2"><h4 className="secondary bold">Conditions d'utilisation</h4></a>
        </article>
        <br />
        <p className="disabled bold" style={styles.copyright}>e-Potek © 2016</p>
      </section>
    );
  }
}
