import { Slingshot } from 'meteor/edgee:slingshot';
import { Tracker } from 'meteor/tracker';

import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';

import { EXOSCALE_PATH, FILE_STATUS } from '../../../api/files/fileConstants';
import { logError } from '../../../api/slack/methodDefinitions';

export default class TempFile extends Component {
  constructor(props) {
    super(props);
    this.state = { progress: 0, error: '' };
  }

  componentDidMount() {
    const {
      file,
      handleUploadComplete,
      handleUploadFailed,
      uploadDirective,
      uploadDirectiveProps,
    } = this.props;

    this.uploader = new Slingshot.Upload(uploadDirective, uploadDirectiveProps);

    const progressSetter = Tracker.autorun(() => {
      const progress = this.uploader.progress();
      this.setState({ progress });
    });

    this.uploader.send(file, (error, downloadUrl) => {
      progressSetter.stop();
      if (error) {
        logError.run({
          error: JSON.parse(
            JSON.stringify(error, Object.getOwnPropertyNames(error)),
          ),
          additionalData: [file],
        });
        this.setState({ error: error.reason || error.message });

        if (handleUploadFailed) {
          handleUploadFailed(error);
        }
      } else {
        const fileObject = {
          name: file.name,
          Key: downloadUrl.split(`${EXOSCALE_PATH}/`).slice(-1)[0],
          url: downloadUrl,
          size: file.size,
          type: file.type,
          status: FILE_STATUS.UNVERIFIED,
        };

        if (handleUploadComplete) {
          handleUploadComplete(fileObject, downloadUrl);
        }
      }
    });
  }

  render() {
    const {
      file: { name },
    } = this.props;
    const { progress, error } = this.state;

    const fileIsUploading = !Number.isNaN(progress);

    return (
      <div className="temp-file flex-col">
        <div className="file">
          <h5 className="secondary bold file-name">{name}</h5>
          {!error &&
            (fileIsUploading ? (
              <div className="uploading-progress">
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={Math.round(progress * 100)}
                />
              </div>
            ) : (
              <div className="waiting-loader">
                <CircularProgress size={24} color="primary" />
              </div>
            ))}
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

TempFile.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  handleUploadComplete: PropTypes.func,
  handleUploadFailed: PropTypes.func,
  id: PropTypes.string.isRequired,
  uploadDirective: PropTypes.string.isRequired,
  uploadDirectiveProps: PropTypes.object.isRequired,
};
