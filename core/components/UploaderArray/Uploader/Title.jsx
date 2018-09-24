import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';

import FileStatusIcon from './FileStatusIcon';
import AdditionalDocDeleter from './AdditionalDocDeleter';

const Title = ({
  fileMeta: { id, label, isAdditionalDoc, required, noTooltips, tooltipSuffix },
  doubleTooltip,
  currentValue,
  displayFull,
  showFull,
  hideFull,
  collection,
  docId,
}) => {
  // Construct the custom tooltip id for this file
  const tooltipId = `files.${id}.tooltip${tooltipSuffix || ''}`;

  return (
    <div className="title">
      <FileStatusIcon files={currentValue} />

      <div className="text">
        <h4 className="flex center">
          {label || (
            <T
              id={`files.${id}`}
              tooltipId={doubleTooltip ? [tooltipId] : tooltipId}
              pureId
              noTooltips={noTooltips}
              tooltipPlacement="top"
            />
          )}
          {required === false ? null : <span className="error">&nbsp;*</span>}
        </h4>
        <h5 className="secondary">
          <span style={{ padding: '0 4px' }}>&bull;</span>
          <T
            id="Uploader.fileCount"
            values={{ count: (currentValue && currentValue.length) || 0 }}
          />
        </h5>
        <AdditionalDocDeleter
          id={id}
          isAdditionalDoc={isAdditionalDoc}
          label={label}
          collection={collection}
          docId={docId}
        />
      </div>

      <IconButton
        type={displayFull ? 'up' : 'down'}
        onClick={(event) => {
          // Don't trigger the file upload due to the <label /> in FileDropper
          event.preventDefault();
          return displayFull ? hideFull() : showFull();
        }}
      />
    </div>
  );
};

Title.propTypes = {
  currentValue: PropTypes.arrayOf(PropTypes.object),
  displayFull: PropTypes.bool.isRequired,
  doubleTooltip: PropTypes.bool,
  fileMeta: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  hideFull: PropTypes.func.isRequired,
  label: PropTypes.string,
  noTooltips: PropTypes.bool,
  required: PropTypes.bool,
  showFull: PropTypes.func.isRequired,
  tooltipSuffix: PropTypes.string,
  userIsAdmin: PropTypes.bool.isRequired,
};

Title.defaultProps = {
  doubleTooltip: false,
  noTooltips: false,
  required: false,
  tooltipSuffix: undefined,
  label: undefined,
  currentValue: [],
};

export default Title;
