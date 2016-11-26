import React, { Component, PropTypes } from 'react';

export default class Step1Page extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
  }

  render() {
    return (
      <section>
        <h1 className="stepTitle">
          1ère Étape
          <small>Encore quelques informations avant qu'on se mette au travail pour vous</small>
        </h1>

        <article className="mask1">
          <h2>Validez votre bien immobilier</h2>
          <DropzoneInput fileName="housePicture" requestId={props.creditRequest._id} />
        </article>

        <article className="mask1">
        <h2>Votre déclaration d'impôts</h2>
        <p>
          Pour permettre au banques de vous faire une offre très précise, nous pouvons leur faire
          savoir que vous nous avez déjà confié votre déclaration d'impôts
        </p>
        <DropzoneInput fileName="housePicture" requestId={props.creditRequest._id} />
        </article>

      </section>
    );
  }
}

Step1Page.propTypes = {
};
