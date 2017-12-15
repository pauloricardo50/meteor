import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import cleanMethod from '/imports/api/cleanMethods';

import ItemVerificator from './ItemVerificator';

export default class FileVerificator extends Component {
  setStatus = (fileKey, newStatus) => {
    const { currentValue, id, docId } = this.props;
    const file = currentValue.find(f => f.key === fileKey);

    cleanMethod(
      this.updateFunc(),
      {
        [`files.${id}`]: [
          ...currentValue.filter(f => f.key !== fileKey),
          { ...file, status: newStatus },
        ],
      },
      docId,
    );
  };

  saveError = (fileKey, error) => {
    const { currentValue, id, docId } = this.props;
    const file = currentValue.find(f => f.key === fileKey);

    cleanMethod(
      this.updateFunc(),
      {
        [`files.${id}`]: [
          ...currentValue.filter(f => f.key !== fileKey),
          { ...file, error },
        ],
      },
      docId,
    );
  };

  updateFunc = () =>
    (this.props.isBorrower ? 'updateBorrower' : 'updateRequest');

  render() {
    const { currentValue, id, closingSteps } = this.props;
    return (
      <div className="mask1 flex-col" style={{ marginBottom: 8 }}>
        <h4>
          {/* If this is a custom uploadX file, get title in the loanRequest's
           last steps */}
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

FileVerificator.propTypes = {};
