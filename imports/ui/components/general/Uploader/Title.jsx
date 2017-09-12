import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';

const Title = ({
  id,
  doubleTooltip,
  noTooltips,
  required,
  currentValue,
  tooltipSuffix,
}) => {
  // Construct the custom tooltip id for this file
  const tooltipId = `files.${id}.tooltip${tooltipSuffix || ''}`;

  return (
    <div className="title">
      <h4>
        <T
          id={`files.${id}`}
          tooltipId={doubleTooltip ? [tooltipId] : tooltipId}
          pureId
          noTooltips={noTooltips}
          tooltipPlacement="top"
        />
        {required === false && '*'}
      </h4>
      <h5 className="secondary">
        <span style={{ padding: '0 4px' }}>&bull;</span>
        <T
          id="DropzoneArrayItem.fileCount"
          values={{ count: (currentValue && currentValue.length) || 0 }}
        />
      </h5>
    </div>
  );
};

Title.propTypes = {};

export default Title;
