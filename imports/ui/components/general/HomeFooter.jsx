import React from 'react';

const styles = {
  article: {
    textDecoration: 'none',
    paddingTop: 150,
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

export default class HomeFooter extends React.Component {
  render() {
    return (
      <section className="col-xs-12 text-center">
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
