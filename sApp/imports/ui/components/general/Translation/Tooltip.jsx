import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';

import { FormattedMessage } from 'react-intl';
import Popover from 'react-bootstrap/lib/Popover';
import Transition from './Transition';
import DialogSimple from '../DialogSimple';

import track from '/imports/js/helpers/analytics';

// Required functions if react motion is used, which wraps the popover
// and shifts it down or right depending on the placement
const getPositionTop = (top, id, placement) => {
  if (
    (placement === 'left' || placement === 'right') &&
    document.getElementById(id)
  ) {
    return top - 0.5 * document.getElementById(id).clientHeight;
  }

  return top;
};

const getPositionLeft = (left, id, placement) => {
  if (
    (placement === 'top' || placement === 'bottom') &&
    document.getElementById(id)
  ) {
    return left - 0.5 * document.getElementById(id).clientWidth;
  }

  return left;
};

const Tooltip = (props) => {
  const {
    placement,
    positionTop,
    positionLeft,
    id,
    pureId,
    hide,
    match,
    dialogLabel,
  } = props;

  let content = null;
  let baseId = id;

  if (isArray(id)) {
    baseId = id[0];
    content = (
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <FormattedMessage id={pureId ? baseId : `tooltip.${baseId}`} />
        <DialogSimple
          title={match}
          rootStyle={{ alignSelf: 'center' }}
          // Dialogs normally have zIndex of 1500
          // Usually dialogs should be behind tooltips (which are
          // at zindex 1501), but when you trigger a dialog from a tooltip,
          // it should be above the previous tooltip, hence 1502
          style={{ zIndex: 1502 }}
          buttonStyle={{ marginTop: 16 }}
          label={dialogLabel || <FormattedMessage id="general.learnMore" />}
          autoFocus
          onOpen={() => track('Tooltip - opened dialog', { tooltipId: baseId })}
          cancelOnly
        >
          <FormattedMessage
            id={pureId ? `${baseId}2` : `tooltip2.${baseId}`}
            values={{
              verticalSpace: (
                <span>
                  <br />
                  <br />
                </span>
              ),
            }}
          />
        </DialogSimple>
      </span>
    );
  } else {
    content = <FormattedMessage id={pureId ? id : `tooltip.${id}`} />;
  }

  const passedProps = omit(props, ['trigger', 'pureId', 'hide', 'match']);

  return (
    // <Transition hide={hide}>
    //   {({ key, style }) =>
    <Popover
      {...passedProps}
      id={baseId}
      // key={key}
      // style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
      // positionTop={getPositionTop(positionTop, baseId, placement)}
      // positionLeft={getPositionLeft(positionLeft, baseId, placement)}
    >
      {content}
    </Popover>
    // }
    // </Transition>
  );
};

Tooltip.propTypes = {};

export default Tooltip;
