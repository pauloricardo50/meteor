import React from 'react';

import Col from 'react-bootstrap/lib/Col';

export default class ProductComparison extends React.Component {
  render() {
    return (
      <section className="text-center home-comparison">
        <h3>Pourquoi e-Potek?</h3>
        <p className="subtitle">Comment éviter l'age de pierre.</p>
        <table>
          <thead>
            <tr>
              <th className="row-1"></th>
              <th className="row-2">
                <h6>Démarche Traditionelle</h6>
                <p>Passer directement par votre banque personnelle</p>
              </th>
              <th className="row-3"><img src="img/logo_black.svg" width="150px" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prêteurs sollicités</td>
              <td>1</td>
              <td>80</td>
            </tr>
            <tr>
              <td>Processus</td>
              <td>Multiples appels téléphoniques et rendez-vous</td>
              <td>En ligne, depuis chez vous</td>
            </tr>
            <tr>
              <td>Prix</td>
              <td>0-1500 CHF de frais de dossier</td>
              <td>Gratuit <br /> <a>Comment vous faites?</a></td>
            </tr>
            <tr>
              <td>Truc 4</td>
              <td></td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Truc 5</td>
              <td></td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
}
