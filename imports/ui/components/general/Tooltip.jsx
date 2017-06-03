import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';

import { FormattedMessage } from 'react-intl';
import Popover from 'react-bootstrap/lib/Popover';
import Transition from './Transition.jsx';
import DialogSimple from './DialogSimple.jsx';

// Required functions if react motion is used, which wraps the popover
// and shifts it down or right depending on the placement
const getPositionTop = (top, id, placement) => {
  if ((placement === 'left' || placement === 'right') && document.getElementById(id)) {
    return top - 0.5 * document.getElementById(id).clientHeight;
  }

  return top;
};

const getPositionLeft = (left, id, placement) => {
  if ((placement === 'top' || placement === 'bottom') && document.getElementById(id)) {
    return left - 0.5 * document.getElementById(id).clientWidth;
  }

  return left;
};

export default class Tooltip extends Component {
  render() {
    const { placement, positionTop, positionLeft, id, hide, match } = this.props;

    let content = null;
    let baseId = id;

    if (_.isArray(id)) {
      baseId = id[0];
      content = (
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <FormattedMessage id={`tooltip.${baseId}`} />
          <DialogSimple
            title={match}
            rootStyle={{ alignSelf: 'center' }}
            buttonStyle={{ marginTop: 16 }}
            label={<FormattedMessage id="general.learnMore" title="Hehe" />}
            autoFocus
          >
            <FormattedMessage
              id={`tooltip2.${baseId}`}
              values={{ verticalSpace: <span><br /><br /></span> }}
            />
          </DialogSimple>
        </span>
      );
    } else {
      content = <FormattedMessage id={`tooltip.${id}`} />;
    }

    return (
      <Transition hide={hide}>
        {({ key, style }) => (
          <Popover
            {...this.props}
            id={baseId}
            key={key}
            style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
            positionTop={getPositionTop(positionTop, baseId, placement)}
            positionLeft={getPositionLeft(positionLeft, baseId, placement)}
          >
            {content}
          </Popover>
        )}
      </Transition>
    );
  }
}

Tooltip.propTypes = {};
