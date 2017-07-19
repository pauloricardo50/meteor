import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import fileSaver from 'file-saver';

import Button from '/imports/ui/components/general/Button.jsx';
import LoopIcon from 'material-ui/svg-icons/av/loop';

import track from '/imports/js/helpers/analytics';

export default class FileDownloader extends Component {
  constructor(props) {
    super(props);

    this.state = { downloading: false };
  }

  handleClick = () => {
    this.setState({ downloading: true }, () => {
      track('FileDownloader - clicked button', {});
      const t0 = performance.now();

      Meteor.call('downloadFile', this.props.fileKey, (err, data) => {
        this.setState({ downloading: false });
        const t1 = performance.now();
        track('FileDownloader - file downloaded', { duration: t1 - t0 });

        if (err) {
          console.log(err);
        } else {
          const blob = new Blob([data.Body], { type: data.ContentType });
          fileSaver.saveAs(blob, this.props.fileName);
        }
      });
    });
  };

  render() {
    return (
      <Button raised
        icon={this.state.downloading && <LoopIcon className="fa-spin" />}
        label={this.props.buttonLabel}
        onTouchTap={this.handleClick}
      />
    );
  }
}

FileDownloader.propTypes = {
  buttonLabel: PropTypes.element.isRequired,
  fileName: PropTypes.string.isRequired,
  fileKey: PropTypes.string.isRequired,
};
