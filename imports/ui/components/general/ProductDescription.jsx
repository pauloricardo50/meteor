import React from 'react';

import Col from 'react-bootstrap/lib/Col';

export default class ProductDescription extends React.Component {
  render() {
    return (
      <section className="container-fluid home-product">
        <article>
          <img src="img/house_white.svg" alt="e-Potek" />
        </article>
        <article className="col-sm-6 col-sm-offset-6 text-center animated fadeIn">
          <span className="fa fa-thumbs-up fa-5x" />
          <h4>Accédez aux meilleures offres du pays</h4>
          <p>Nous allons voir tous les preteurs potentiels pour vous, sans effort.</p>
        </article>
        <article className="col-sm-6 text-center animated fadeIn">
          <span className="fa fa-check-square fa-5x" />
          <h4>Gardez un oeil sur vos crédits courants.</h4>
          <p>Nous prenons en charge vos financements existants, et vous notifions quand il est
          temps de les renouveller.</p>
        </article>
        <article className="col-sm-6 col-sm-offset-6 text-center animated fadeIn">
          <span className="fa fa-thumbs-up fa-5x" />
          <h4>En toute simplicité, online</h4>
          <p>Faites toutes les démarches requises à votre rhythme, depuis votre canapé,
          ou sur votre smartphone.</p>
        </article>
      </section>
    );
  }
}
