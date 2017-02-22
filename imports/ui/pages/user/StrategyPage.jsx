import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Badge from 'material-ui/Badge';


export default class StrategyPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Stratégies - e-Potek');
  }


  getStrategies() {
    const r = this.props.loanRequest;
    return [
      {
        id: 'cash',
        title: 'Stratégie de Fonds Propres',
        description: 'Ajustez la répartition vos fonds propres pour définir la taille de votre emprunt',
        notification: !r.logic.hasValidatedCashStrategy,
        show: true,
      }, {
        id: 'loan',
        title: 'Stratégie de Taux',
        description: 'Définissez comment répartir votre emprunt et maitrisez le risque que vous prenez',
        notification: !r.logic.loanStrategyPreset && r.logic.step > 1,
        show: r.logic.step > 1,
      }, {
        id: 'amortizing',
        title: 'Stratégie d\'Amortissement',
        description: 'Choisissez comment amortir votre emprunt, et optimisez votre situation fiscale',
        notification: !r.logic.amortizingStrategyPreset && r.logic.step > 1,
        show: r.logic.step > 1,
      },
    ];
  }

  render() {
    return (
      <section className="strategy-page animated fadeIn">
        {this.getStrategies().map((strat, i) => {
          if (strat.show) {
            return (
              <a className="mask1 hover-rise" key={i} href={`/strategy/${strat.id}`}>
                <div className="description">
                  <h3 className="fixed-size">
                    {strat.notification
                      ? (
                        <Badge
                          badgeContent={1}
                          primary
                          badgeStyle={{ position: 'absolute', right: -30 }}
                          style={{ padding: 0 }}
                        >
                          <span>{strat.title}</span>
                        </Badge>
                      )
                      : <span>{strat.title} <span className="fa fa-check success" /></span>
                    }
                  </h3>
                  <p>{strat.description}</p>
                </div>
                <div className="arrow">
                  <span className="fa fa-caret-right fa-2x" />
                </div>
              </a>
            );
          }
          return null;
        })}
      </section>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.any),
};
