import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import { SLINGSHOT_DIRECTIVE_NAME } from '../../../api/constants';

export default class TempFile extends Component {
  constructor(props) {
    super(props);
    this.state = { progress: 0, error: '' };
  }

  componentDidMount() {
    const {
      currentValue,
      collection,
      docId,
      id,
      uploadCount,
      file,
      handleSave,
    } = this.props;

    this.uploader = new Slingshot.Upload(SLINGSHOT_DIRECTIVE_NAME, {
      currentValue,
      collection,
      docId,
      id,
      uploadCount,
    });

    const progressSetter = Tracker.autorun(() => {
      this.setState({ progress: this.uploader.progress() });
    });

    this.uploader.send(file, (error, downloadUrl) => {
      progressSetter.stop();
      if (error) {
        this.setState({ error: error.message });
      } else {
        handleSave(file, downloadUrl);
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
      <div className="flex-col">
        <div
          className="file"
          style={{ height: 48, justifyContent: 'flex-start' }}
        >
          <h5 className="secondary bold">{name}</h5>
          {!error
            && (fileIsUploading ? (
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
            ))}
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

TempFile.propTypes = {
  collection: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object).isRequired,
  docId: PropTypes.string.isRequired,
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
