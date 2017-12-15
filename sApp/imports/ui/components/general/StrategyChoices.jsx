import PropTypes from 'prop-types';
import React, { Component } from 'react';

import classNames from 'classnames';
import track from '/imports/js/helpers/analytics';
import { T } from 'core/components/Translation';

export default class StrategyChoices extends Component {
  renderChoice(choice, index) {
    const { value, name, handleChoose, disabled } = this.props;
    const chosen = value === choice.id;
    const articleClasses = classNames({
      choice: true,
      chosen,
      disabled,
    });

    return (
      <article className={articleClasses} key={index}>
        <div
          className="content"
          onClick={() => {
            if (disabled) {
              // do nothing
            } else if (chosen) {
              handleChoose('');
            } else {
              track(`StrategyChoices - chose ${name}`, { choiceId: choice.id });
              handleChoose(choice.id);
            }
          }}
        >
          <div className="top">
            <h4 className="title bold">{choice.title}</h4>
            {choice.isBest && (
              <div className="recommended">
                <T id="StrategyChoices.recommended" />
              </div>
            )}
          </div>
          <div className="reasons secondary">
            {choice.reasons
              .map(reason => <span key={reason}>{reason}</span>)
              .reduce((prev, curr, i) => [
                prev,
                <span key={i}> &bull; </span>,
                curr,
              ])}
          </div>
        </div>
        {!!(chosen && choice.children) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <hr />
            {choice.children}
          </div>
        )}
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  handleChoose: PropTypes.func,
  name: PropTypes.string.isRequired,
};

StrategyChoices.defaultProps = {
  load: false,
  handleChoose: undefined,
  value: undefined,
};
