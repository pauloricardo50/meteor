import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import Col from 'react-bootstrap/lib/Col';

const Step2OffersTable = () => (
  <Panel>
    <h3>Les résultats sont arrivés</h3>
    <h6>
      Voici les 3 meilleures offres que vous avez reçues
      <small>
        Pour toutes les voir, cliquez
        <a>ici.</a>
      </small>
    </h6>

    <article className="col-sm-4">
      <div className="offers-card">

        <div className="card-choose">
          <h4>Choisir</h4>
        </div>

        <div className="card-body">
          <div className="card-head">
            <h5>Le Moins Cher</h5>
            <p>Ce pret vous coûtera le moins cher avec son taux d'intérêt bas</p>
          </div>
          <hr />

          <h5>Taux: 0.80%</h5>
          <h5>Amortissement: 1.00%</h5>
          <h5>Prêt: CHF 354'000</h5>
          <h5>Expertise: Oui</h5>
        </div>
      </div>

    </article>

    <article className="col-sm-4">
      <div className="offers-card">

        <div className="card-choose">
          <h4>Choisir</h4>
        </div>

        <div className="card-body">
          <div className="card-head">
            <h5>Le Plus Gros</h5>
            <p>Ce pret vous permet de mettre un minimum de fonds propres</p>
          </div>
          <hr />

          <h5>Taux: 0.85%</h5>
          <h5>Amortissement: 1.05%</h5>
          <h5>Prêt: CHF 389'000</h5>
          <h5>Expertise: Oui</h5>
        </div>
      </div>

    </article>

    <article className="col-sm-4">
      <div className="offers-card">

        <div className="card-choose">
          <h4>Choisir</h4>
        </div>

        <div className="card-body">
          <div className="card-head">
            <h5>Le Plus Rapide</h5>
            <p>Ce prêt n'a pas besoin d'expertise, et peut donc être obtenu cette semaine</p>
          </div>
          <hr />

          <h5>Taux: 0.88%</h5>
          <h5>Amortissement: 1.20%</h5>
          <h5>Prêt: CHF 361'000</h5>
          <h5>Expertise: Non</h5>
        </div>
      </div>

    </article>

  </Panel>
);

export default Step2OffersTable;
