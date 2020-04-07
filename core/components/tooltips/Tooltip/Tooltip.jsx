import { Meteor } from 'meteor/meteor';

import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';

import Button from '../../Button';
import DialogSimple from '../../DialogSimple/loadable';
import T from '../../Translation';
import defaultIntlValues from '../../Translation/defaultIntlValues';
import TooltipSynonyms from '../TooltipSynonyms';

const getTooltip1Id = id => (id.includes('tooltip') ? id : `tooltip.${id}`);
const getTooltip2Id = id => (id.includes('tooltip') ? id : `tooltip2.${id}`);

const Tooltip = ({
  tooltipConfig: { id, double: isDoubleTooltip },
  match,
  open,
  anchorRef,
  handleClose,
  ...rest
}) => {
  let content = null;

  if (isDoubleTooltip) {
    content = (
      <span className="tooltip">
        <T id={getTooltip1Id(id)} />
        <DialogSimple
          title={match}
          // Dialogs normally have zIndex of 1500
          // Usually dialogs should be behind tooltips (which are
          // at zindex 1501), but when you trigger a dialog from a tooltip,
          // it should be above the previous tooltip, hence 1502
          style={{ zIndex: 1502 }}
          buttonStyle={{ marginTop: 16, margin: '0 auto' }}
          label={<T id="general.learnMore" />}
          autoFocus
          actions={handleCloseDialog => (
            <Button
              primary
              label={<T id="general.ok" />}
              onClick={handleCloseDialog}
            />
          )}
        >
          <TooltipSynonyms tooltipId={id} match={match} />
          <br />
          <br />
          <T id={getTooltip2Id(id)} values={defaultIntlValues} />
        </DialogSimple>
      </span>
    );
  } else {
    content = <T id={getTooltip1Id(id)} />;
  }

  const passedProps = omit(rest, ['hide', 'match']);

  if (Meteor.isServer) {
    // Popper needs document to be defined, so it does not work on the server..
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Popper {...passedProps} open={open} id={id} anchorEl={anchorRef.current}>
        <Paper style={{ padding: 8, maxWidth: 300 }} elevation={15}>
          {content}
        </Paper>
      </Popper>
    </ClickAwayListener>
  );
};

Tooltip.propTypes = {
  match: PropTypes.string,
  open: PropTypes.bool.isRequired,
  tooltipConfig: PropTypes.object.isRequired,
};

export default Tooltip;
