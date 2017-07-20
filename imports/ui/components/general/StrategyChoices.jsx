import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Button from '/imports/ui/components/general/Button.jsx';
import classNames from 'classnames';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';
import track from '/imports/js/helpers/analytics';

import { LoadingComponent } from './Loading.jsx';

export default class StrategyChoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChoices: false,
    };

    this.timeout = Meteor.setTimeout(() => {
      this.setState({ showChoices: true });
    }, this.props.load ? 2500 : 0);
  }

  componentWillUnmount() {
    if (this.timeout) {
      Meteor.clearTimeout(this.timeout);
    }
  }

  renderChoice(choice, index) {
    const chosen = this.props.currentValue === choice.id;
    const articleClasses = classNames({
      mask1: true,
      'text-center': true,
      mask2: choice.isBest,
      chosen,
    });

    return (
      <article className={articleClasses} key={index}>
        {choice.isBest &&
          !this.props.currentValue &&
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
            <li className="bold reason" key={i}>
              <AutoTooltip>
                {reason}
              </AutoTooltip>
            </li>,
          )}
        </ul>

        <div className="button">
          <Button raised
            primary={!this.props.currentValue}
            label={chosen ? 'Annuler' : 'Choisir'}
            onTouchTap={() => {
              if (chosen) {
                this.props.handleChoose('');
              } else {
                track(`StrategyChoices - chose ${this.props.name}`, {
                  choiceId: choice.id,
                });
                this.props.handleChoose(choice.id);
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
        {this.state.showChoices
          ? this.props.choices.map((choice, index) =>
              this.renderChoice(choice, index),
            )
          : <span className="loading">
              <LoadingComponent />
            </span>}
      </div>
    );
  }
}

StrategyChoices.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  load: PropTypes.bool,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  handleChoose: PropTypes.func,
  name: PropTypes.string.isRequired,
};

StrategyChoices.defaultProps = {
  load: false,
  handleChoose: undefined,
  currentValue: undefined,
};
