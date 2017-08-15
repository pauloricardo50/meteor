import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from '/imports/ui/components/general/Button.jsx';
import classNames from 'classnames';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';
import track from '/imports/js/helpers/analytics';

export default class StrategyChoices extends Component {
  renderChoice(choice, index) {
    const { currentValue, name, handleChoose } = this.props;
    const chosen = currentValue === choice.id;
    const articleClasses = classNames({
      mask1: true,
      'text-center': true,
      mask2: choice.isBest,
      chosen,
    });

    return (
      <article className={articleClasses} key={index}>
        {choice.isBest &&
          !currentValue &&
          <div className="recommended animated fadeIn">
            <div className="bold">Recommandé pour vous</div>
          </div>}

        <ul>
          <li className={chosen ? 'title-chosen' : 'title'}>
            <h4 className="bold fixed-size">
              <AutoTooltip>{choice.title}</AutoTooltip>{' '}
              {chosen && <span className="fa fa-check" />}
            </h4>
          </li>

          {choice.reasons.map((reason, i) =>
            (<li className="bold reason" key={i}>
              <AutoTooltip>
                {reason}
              </AutoTooltip>
            </li>),
          )}
        </ul>

        <div className="button">
          <Button
            raised
            primary={!currentValue}
            label={chosen ? 'Annuler' : 'Choisir'}
            onTouchTap={() => {
              if (chosen) {
                handleChoose('');
              } else {
                track(`StrategyChoices - chose ${name}`, {
                  choiceId: choice.id,
                });
                handleChoose(choice.id);
              }
            }}
          />
        </div>
      </article>
    );
  }

  render() {
    return (
      <div className="strategy-choices">
        {this.props.choices.map((choice, index) =>
          this.renderChoice(choice, index),
        )}
      </div>
    );
  }
}

StrategyChoices.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  handleChoose: PropTypes.func,
  name: PropTypes.string.isRequired,
};

StrategyChoices.defaultProps = {
  load: false,
  handleChoose: undefined,
  currentValue: undefined,
};
