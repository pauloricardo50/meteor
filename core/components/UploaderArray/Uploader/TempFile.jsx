import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class TempFile extends Component {
  constructor(props) {
    super(props);
    this.state = { progress: 0, error: '' };
  }

  componentDidMount() {
    this.uploader = new Slingshot.Upload('myFileUploads', {
      currentValue: this.props.currentValue,
      collection: this.props.collection,
      docId: this.props.docId,
      id: this.props.id,
      uploadCount: this.props.uploadCount,
    });

    const progressSetter = Tracker.autorun(() => {
      this.setState({ progress: this.uploader.progress() });
    });

    this.uploader.send(this.props.file, (error, downloadUrl) => {
      progressSetter.stop();
      if (error) {
        // TODO: Show an error here
        console.log('TempFile error', error);
        this.setState({ error: error.message });
      } else {
        this.props.handleSave(this.props.file, downloadUrl);
      }
    });
  }

  render() {
    const { name } = this.props.file;
    const { progress, error } = this.state;

    return (
      <div className="flex-col">
        <div
          className="file"
          style={{ height: 48, justifyContent: 'flex-start' }}
        >
          <h5 className="secondary bold">{name}</h5>
          {!Number.isNaN(progress) ? (
            <div style={{ paddingLeft: 16, flexGrow: 1 }}>
              <LinearProgress
                color="primary"
                variant="determinate"
                value={Math.round(progress * 100)}
              />
            </div>
          ) : (
            <div style={{ paddingLeft: 16 }}>
              <CircularProgress size={24} color="primary" />
            </div>
          )}
        </div>
        {!error && <p className="error">{error}</p>}
      </div>
    );
  }
}

TempFile.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object).isRequired,
};
