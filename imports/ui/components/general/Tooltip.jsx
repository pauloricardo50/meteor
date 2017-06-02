import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import Popover from 'react-bootstrap/lib/Popover';
import Transition from './Transition.jsx';

// Required functions if react motion is used, which wraps the popover
// and shifts it down or right depending on the placement
const getPositionTop = (top, id) => {
  if (document.getElementById(id)) {
    top -= 0.5 * document.getElementById(id).clientHeight;
  }

  return top;
};

const getPositionLeft = (left, id) => {
  if (document.getElementById(id)) {
    left -= 0.5 * document.getElementById(id).clientWidth;
  }

  return left;
};

export default class Tooltip extends Component {
  render() {
    const { placement, positionTop, positionLeft, id, hide } = this.props;

    return (
      <Transition id={id} hide={hide}>
        {({ key, style }) => (
          <Popover
            {...this.props}
            key={key}
            style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
            positionTop={
              placement === 'left' || placement === 'right'
                ? getPositionTop(positionTop, id)
                : positionTop
            }
            positionLeft={
              placement === 'top' || placement === 'bottom'
                ? getPositionLeft(positionLeft, id)
                : positionLeft
            }
          >
            <FormattedMessage id={`tooltip.${id}`} />
          </Popover>
        )}
      </Transition>
    );
  }
}

Tooltip.propTypes = {};
