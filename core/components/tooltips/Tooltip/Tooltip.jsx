import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { FormattedMessage } from 'react-intl';
import Popover from 'react-bootstrap/lib/Popover';

import DialogSimple from '../../DialogSimple/loadable';
import Button from '../../Button';
import defaultIntlValues from '../../Translation/defaultIntlValues';
import T from '../../Translation';
import TooltipSynonyms from '../TooltipSynonyms';

const getTooltip1Id = id => (id.includes('tooltip') ? id : `tooltip.${id}`);
const getTooltip2Id = id => (id.includes('tooltip') ? id : `tooltip2.${id}`);

const Tooltip = ({
  tooltipConfig: { id, double: isDoubleTooltip },
  match,
  ...rest
}) => {
  let content = null;

  if (isDoubleTooltip) {
    content = (
      <span className="tooltip">
        <FormattedMessage id={getTooltip1Id(id)} />
        <DialogSimple
          title={match}
          // Dialogs normally have zIndex of 1500
          // Usually dialogs should be behind tooltips (which are
          // at zindex 1501), but when you trigger a dialog from a tooltip,
          // it should be above the previous tooltip, hence 1502
          style={{ zIndex: 1502 }}
          buttonStyle={{ marginTop: 16 }}
          label={<FormattedMessage id="general.learnMore" />}
          autoFocus
          actions={handleClose => (
            <Button
              primary
              label={<T id="general.ok" />}
              onClick={handleClose}
            />
          )}
        >
          <TooltipSynonyms tooltipId={id} match={match} />
          <br />
          <br />
          <FormattedMessage id={getTooltip2Id(id)} values={defaultIntlValues} />
        </DialogSimple>
      </span>
    );
  } else {
    content = <FormattedMessage id={getTooltip1Id(id)} />;
  }

  const passedProps = omit(rest, ['trigger', 'hide', 'match']);

  return (
    <Popover {...passedProps} id={id}>
      {content}
    </Popover>
  );
};

Tooltip.propTypes = {
  match: PropTypes.string,
  tooltipConfig: PropTypes.object.isRequired,
};

export default Tooltip;
