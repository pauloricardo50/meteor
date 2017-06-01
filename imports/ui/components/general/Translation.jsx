import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  FormattedRelative,
  FormattedNumber,
  FormattedPlural,
} from 'react-intl';

import AutoTooltip from './AutoTooltip.jsx';

/**
* T - A wrapper around react-intl's Formatted Message, it
* automatically adds tooltips if they exist.
* It is only rerendered if the id changes
* @extends Component
*/
export class T extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.id !== this.props.id;
  // }

  render() {
    if (this.props.noTooltips) {
      return <FormattedMessage {...this.props} />;
    } else if (typeof this.props.id !== 'string') {
      return this.props.id;
    }

    // formattedMessage provides an array of values in the children function.
    // When there is more than a simple string to render, for example a rich
    // HTML element was added as a values prop, then it returns several values
    // To avoid unnecessary spans, separate those with a single message
    // and those, rare, with more.
    return (
      <FormattedMessage {...this.props}>
        {(...formattedMessage) =>
          formattedMessage.length === 1
            ? <AutoTooltip
              {...this.props}
              id={this.props.tooltipId}
              placement={this.props.tooltipPlacement}
            >
              {formattedMessage[0]}
            </AutoTooltip>
            : <span>
              {formattedMessage.map((msg, i) => (
                <AutoTooltip
                  {...this.props}
                  id={this.props.tooltipId}
                  placement={this.props.tooltipPlacement}
                  key={i}
                >
                  {msg}
                </AutoTooltip>
                ))}
            </span>}
      </FormattedMessage>
    );
  }
}

T.propTypes = {
  id: PropTypes.string.isRequired,
  noTooltips: PropTypes.bool,
  tooltipId: PropTypes.string,
  tooltipPlacement: PropTypes.string,
};

T.defaultProps = {
  noTooltips: false,
  tooltipId: undefined,
  tooltipPlacement: undefined,
};

export const IntlDate = props => {
  switch (props.type) {
    case 'time':
      return <FormattedTime {...props} />;
    case 'relative':
      return <FormattedRelative {...props} />;
    default:
      return <FormattedDate {...props} />;
  }
};

export const IntlNumber = props => {
  switch (props.type) {
    case 'plural':
      return <FormattedPlural {...props} />;
    default:
      return <FormattedNumber {...props} />;
  }
};
