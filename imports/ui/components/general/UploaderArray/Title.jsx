import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';

import FileStatusIcon from './FileStatusIcon';

const Title = ({
  id,
  doubleTooltip,
  noTooltips,
  required,
  currentValue,
  tooltipSuffix,
  title,
}) => {
  // Construct the custom tooltip id for this file
  const tooltipId = `files.${id}.tooltip${tooltipSuffix || ''}`;

  return (
    <div className="title">
      <FileStatusIcon files={currentValue} />

      <div className="text">
        <h4 className="flex center">
          {title || (
            <T
              id={`files.${id}`}
              tooltipId={doubleTooltip ? [tooltipId] : tooltipId}
              pureId
              noTooltips={noTooltips}
              tooltipPlacement="top"
            />
          )}
          {required === false && '*'}
        </h4>
        <h5 className="secondary">
          <span style={{ padding: '0 4px' }}>&bull;</span>
          <T
            id="Uploader.fileCount"
            values={{ count: (currentValue && currentValue.length) || 0 }}
          />
        </h5>
      </div>
    </div>
  );
};

Title.propTypes = {
  id: PropTypes.string.isRequired,
  doubleTooltip: PropTypes.bool,
  noTooltips: PropTypes.bool,
  required: PropTypes.bool,
  currentValue: PropTypes.arrayOf(PropTypes.object).isRequired,
  tooltipSuffix: PropTypes.string,
  title: PropTypes.string,
};

export default Title;
