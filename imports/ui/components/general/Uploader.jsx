import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const UploaderTitle = ({
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

const File = ({ name, size, type, url, fileCount, status, error }) =>
  (<div className="file">
    <h5 className="secondary bold">
      {name}
    </h5>
    <div>
      <span className={`${status} bold`}>
        <T id={`Files.status.${status}`} />
      </span>
      {<Button label={<T id="general.delete" />} />}
    </div>
  </div>);

const Uploader = (props) => {
  const { file, doc } = props;
  const { id } = file;

  // All files are always stored at the root of an object in 'files'
  const currentValue = doc.files[id];

  return (
    <div className="uploader">
      <UploaderTitle {...file} currentValue={currentValue} />
      {currentValue && currentValue.map(f => <File key={f.key} {...f} />)}
    </div>
  );
};

Uploader.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Uploader;
