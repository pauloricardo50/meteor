import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

export default class StrategyPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Stratégies - e-Potek');
  }


  getStrategies() {
    return [
      {
        id: 'cash',
        title: 'Stratégie de Fonds Propres',
        description: 'Ajustez la répartition vos fonds propres pour définir la taille de votre emprunt',
      }, {
        id: 'loan',
        title: 'Stratégie de Taux',
        description: 'Définissez comment répartir votre emprunt et maitrisez le risque que vous prenez',
      }, {
        id: 'amortizing',
        title: 'Stratégie d\'Amortissement',
        description: 'Choisissez comment amortir votre emprunt, et optimisez votre situation fiscale',
      },
    ];
  }

  render() {
    return (
      <section className="strategy-page">
        {this.getStrategies().map((strat, i) => (
          <a className="mask1 hover-rise" key={i} href={`/strategy/${strat.id}`}>
            <div className="description">
              <h3 className="fixed-size">{strat.title}</h3>
              <p>{strat.description}</p>
            </div>
            <div className="arrow">
              <span className="fa fa-caret-right fa-2x" />
            </div>
          </a>
        ))}
      </section>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.any),
};
