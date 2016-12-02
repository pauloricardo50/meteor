import React from 'react';


const styles = {
  image: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 200,
  },
  article: {
    height: 250,
    marginBottom: 50,
  },
};


export default class ProductDescription extends React.Component {
  render() {
    return (
      <section>
        <div className="col-xs-12  col-md-6 col-md-offset-3">
          <img src="img/product_description.png" alt="Notre produit" style={styles.image} />
        </div>

        <article
          className="col-sm-2 col-sm-offset-2 col-xs-8 col-xs-offset-2 mask1"
          style={styles.article}
        >
          <h4>Sans engagement</h4><br />
          <p>Avancez à votre rhythme, arrêtez quand vous voulez.</p>
        </article>

        <article
          className="col-sm-2 col-sm-offset-1 col-xs-8 col-xs-offset-2 mask1"
          style={styles.article}
        >
          <h4>Gratuit, pour toujours</h4><br />
          <p>Tous nos services sont gratuits, sans frais cachés.</p>
          <br />
          <a><small>Comment vous faites?</small></a>
        </article>

        <article
          className="col-sm-2 col-sm-offset-1 col-xs-8 col-xs-offset-2 mask1"
          style={styles.article}
        >
          <h4>En toute sécurité</h4><br />
          <p>Vos données sont en sureté, et vous avez une confidentialité maximale.</p>
        </article>

      </section>
    );
  }
}
