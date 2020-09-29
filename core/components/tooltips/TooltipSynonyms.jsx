import React from 'react';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import { generalTooltips } from '../../arrays/tooltips';
import T from '../Translation';

const findSynonymsForTooltipId = (tooltipId, match, tooltips) =>
  Object.keys(tooltips)
    .filter(tooltipMatcher => tooltips[tooltipMatcher].id === tooltipId)
    .filter(synonym => synonym !== match.toLowerCase());

export const TooltipSynonyms = ({ tooltipId, match, tooltips }) => {
  const synonyms = findSynonymsForTooltipId(tooltipId, match, tooltips);

  if (!synonyms || synonyms.length <= 0) {
    return null;
  }

  return (
    <span className="tooltip-synonyms">
      <b>
        <T id="TooltipSynonyms.title" values={{ count: synonyms.length }} />:
      </b>
      <i>{synonyms.join(', ')}</i>
    </span>
  );
};

TooltipSynonyms.propTypes = {
  match: PropTypes.string.isRequired,
  tooltipId: PropTypes.string.isRequired,
  tooltips: PropTypes.object.isRequired,
};

export default withProps({ tooltips: generalTooltips })(TooltipSynonyms);
