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
    }
    return (
      <FormattedMessage {...this.props}>
        {formattedMessage => {
          return (
            <AutoTooltip
              {...this.props}
              id={this.props.tooltipId}
              placement={this.props.tooltipPlacement}
            >
              {formattedMessage}
            </AutoTooltip>
          );
        }}
      </FormattedMessage>
    );
  }
}

T.propTypes = {
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
