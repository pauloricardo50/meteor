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
    const { currentValue, id, closingSteps } = this.props;
    return (
      <div className="mask1 flex-col" style={{ marginBottom: 8 }}>
        <h4>
          {/* If this is a custom uploadX file,
                    get title in the loan's last steps */}
          {id.indexOf('upload') >= 0 ? (
            (closingSteps.find(s => s.id === id) &&
              closingSteps.find(s => s.id === id).title) ||
            id
          ) : (
            <T id={`files.${id}`} />
          )}
        </h4>
        {currentValue &&
          currentValue
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
  currentValue: PropTypes.arrayOf(PropTypes.object),
  closingSteps: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  setFileStatus: PropTypes.func.isRequired,
  setFileError: PropTypes.func.isRequired,
};

FileVerificator.defaultProps = {
  currentValue: [],
  closingSteps: [],
};

export default FileVerificatorContainer(FileVerificator);
