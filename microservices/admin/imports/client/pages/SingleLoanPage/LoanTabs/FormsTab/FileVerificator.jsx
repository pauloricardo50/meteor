import React, { Component } from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

import FileVerificatorContainer from './FileVerificatorContainer';
import ItemVerificator from './ItemVerificator';

class FileVerificator extends Component {
  setStatus = (fileKey, newStatus) => {
    const { setFileStatus } = this.props;
    setFileStatus(fileKey, newStatus);
  };

  saveError = (fileKey, error) => {
    const { setFileError } = this.props;
    return setFileError(fileKey, error);
  };

  render() {
    const { currentValue, id } = this.props;
    return (
      <div className="card1 card-top flex-col" style={{ marginBottom: 8 }}>
        <h4>
          <T id={`files.${id}`} />
        </h4>
        {currentValue
          && currentValue
            .sort((a, b) => a.fileCount > b.fileCount)
            .map(f => (
              <ItemVerificator
                item={f}
                key={f.key}
                id={id}
                setStatus={this.setStatus}
                saveError={this.saveError}
              />
            ))}
      </div>
    );
  }
}

FileVerificator.propTypes = {
  closingSteps: PropTypes.arrayOf(PropTypes.object),
  currentValue: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  setFileError: PropTypes.func.isRequired,
  setFileStatus: PropTypes.func.isRequired,
};

FileVerificator.defaultProps = {
  currentValue: [],
  closingSteps: [],
};

export default FileVerificatorContainer(FileVerificator);
