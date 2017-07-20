import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loadable from '/imports/js/helpers/loadable';

// const {
//   FormattedMessage,
//   FormattedDate,
//   FormattedTime,
//   FormattedRelative,
//   FormattedNumber,
//   FormattedPlural,
// } = Loadable({ loader: () => import('react-intl') });
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
  render() {
    const {
      noTooltips,
      id,
      values,
      tooltipId,
      tooltipPlacement,
      tooltipDelay,
    } = this.props;

    if (noTooltips) {
      return <FormattedMessage {...this.props} />;
    } else if (typeof id !== 'string') {
      return id;
    }

    // formattedMessage provides an array of values in the children function.
    // When there is more than a simple string to render, for example a rich
    // HTML element was added as a values prop, then it returns several values
    // To avoid unnecessary spans, separate those with a single message
    // and those, rare, with more.
    const Auto = (content, key) =>
      <AutoTooltip
        {...this.props}
        id={tooltipId}
        placement={tooltipPlacement}
        delay={tooltipDelay}
        key={key}
      >
        {content}
      </AutoTooltip>;

    return (
      <FormattedMessage
        id={id}
        values={{
          ...values,
          verticalSpace: (
            <span>
              <br />
              <br />
            </span>
          ),
        }}
      >
        {(...formattedMessage) =>
          formattedMessage.length === 1
            ? Auto(formattedMessage[0])
            : <span>
                {formattedMessage.map((msg, i) => Auto(msg, i))}
              </span>}
      </FormattedMessage>
    );
  }
}

T.propTypes = {
  id: PropTypes.string.isRequired,
  noTooltips: PropTypes.bool,
  tooltipId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
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
