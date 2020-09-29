import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../../IconButton';
import T from '../../Translation';
import FileStatusIcon from './FileStatusIcon';

const Title = ({
  fileMeta: { id, label, noTooltips, tooltipSuffix, required, tooltip },
  currentValue,
  displayFull,
  toggleDisplayFull,
  uploaderTopRight,
}) => {
  // Construct the custom toocanModifyltip id for this file
  const tooltipId = `files.${id}.tooltip${tooltipSuffix || ''}`;
  const hasTooltip = !!tooltip || !noTooltips;

  return (
    <div className="title">
      <div className="title-top">
        <FileStatusIcon files={currentValue} />

        <div>
          <h3 className="font-size-5 text-main">
            {label || <T id={`files.${id}`} />}
            {required === false ? null : <span className="error">&nbsp;*</span>}
          </h3>
          <span className="secondary file-count">
            <span style={{ padding: '0 4px' }}>&bull;</span>
            <T
              defaultMessage="{count, plural, =0 {0 fichiers} one {Un fichier} other {# fichiers}}"
              values={{ count: (currentValue && currentValue.length) || 0 }}
            />
          </span>
        </div>
        {uploaderTopRight}

        <IconButton
          type={displayFull ? 'up' : 'down'}
          onClick={event => {
            // Don't trigger the file upload due to the <label /> in FileDropper
            event.preventDefault();
            return toggleDisplayFull();
          }}
          className="display-toggle"
          size="small"
        />
      </div>

      {hasTooltip && (
        <small className="title-bottom">
          {tooltip || <T id={tooltipId} />}
        </small>
      )}
    </div>
  );
};

Title.propTypes = {
  currentValue: PropTypes.arrayOf(PropTypes.object),
  displayFull: PropTypes.bool.isRequired,
  fileMeta: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  label: PropTypes.string,
  noTooltips: PropTypes.bool,
  required: PropTypes.bool,
  toggleDisplayFull: PropTypes.func.isRequired,
  tooltipSuffix: PropTypes.string,
  userIsAdmin: PropTypes.bool.isRequired,
};

Title.defaultProps = {
  noTooltips: false,
  required: false,
  tooltipSuffix: undefined,
  label: undefined,
  currentValue: [],
};

export default Title;
