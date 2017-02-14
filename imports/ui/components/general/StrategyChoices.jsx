import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods';

import RaisedButton from 'material-ui/RaisedButton';
import classNames from 'classnames';

import { LoadingComponent } from './Loading.jsx';


export default class StrategyChoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChoices: false,
    };

    Meteor.setTimeout(() => {
      this.setState({ showChoices: true });
    }, (this.props.load ? 2500 : 0));
  }

  handleClick(choiceId) {
    const object = {};
    const id = this.props.requestId;
    // Only change fortune when changing the slider, let insuranceFortune the same
    object[this.props.valueId] = choiceId;

    updateValues.call({ object, id });
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
      <article className={articleClasses} key={index} >
        {choice.isBest &&
          <div className="recommended">
            <div className="bold">
              Recommandé pour vous
            </div>
          </div>
        }

        <ul>
          <li className="title">
            <h4 className="bold">
              {choice.title}&nbsp;{chosen && <span className="fa fa-check" />}
            </h4>
          </li>

          {choice.reasons.map((reason, i) =>
            <li className="bold reason" key={i}>{reason}</li>,
          )}
        </ul>

        <div className="button">
          <RaisedButton
            primary={!this.props.currentValue}
            label="Choisir"
            onClick={() => this.handleClick(choice.id)}
          />
        </div>
      </article>
    );
  }

  render() {
    return (
      <div className="strategy-choices">

        {this.state.showChoices ?
          this.props.choices.map((choice, index) => (this.renderChoice(choice, index))) :
          <span className="loading">
            <LoadingComponent />
          </span>
        }

      </div>
    );
  }
}

StrategyChoices.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  load: PropTypes.bool,
  requestId: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.any,
  ]),
  valueId: PropTypes.string.isRequired,
};

StrategyChoices.defaultProps = {
  load: false,
};
