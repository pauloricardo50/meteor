import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import ConfirmMethod from 'core/components/ConfirmMethod';
import IconButton from 'core/components/IconButton';

import FileStatusIcon from './FileStatusIcon';

const Title = ({
  fileMeta: { id },
  doubleTooltip,
  noTooltips,
  required,
  currentValue,
  tooltipSuffix,
  label,
  userIsAdmin,
  isOwnedByAdmin,
  removeDocument,
  displayFull,
  showFull,
  hideFull,
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
          {required === false ? '' : ' *'}
        </h4>
        <h5 className="secondary">
          <span style={{ padding: '0 4px' }}>&bull;</span>
          <T
            id="Uploader.fileCount"
            values={{ count: (currentValue && currentValue.length) || 0 }}
          />
        </h5>
      </div>

      {userIsAdmin &&
        isOwnedByAdmin && (
        <ConfirmMethod
          label={<T id="general.delete" />}
          keyword="SUPPRIMER"
          method={removeDocument}
        />
      )}
      <IconButton
        type={displayFull ? 'up' : 'down'}
        onClick={displayFull ? hideFull : showFull}
      />
    </div>
  );
};

Title.propTypes = {
  fileMeta: PropTypes.object.isRequired,
  doubleTooltip: PropTypes.bool,
  noTooltips: PropTypes.bool,
  required: PropTypes.bool,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  tooltipSuffix: PropTypes.string,
  label: PropTypes.string,
  userIsAdmin: PropTypes.bool.isRequired,
  isOwnedByAdmin: PropTypes.bool,
  removeDocument: PropTypes.func.isRequired,
  displayFull: PropTypes.bool.isRequired,
  hideFull: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

Title.defaultProps = {
  doubleTooltip: false,
  noTooltips: false,
  required: false,
  tooltipSuffix: undefined,
  label: undefined,
  isOwnedByAdmin: false,
  currentValue: [],
};

export default Title;
