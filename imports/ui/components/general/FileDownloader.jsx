import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import fileSaver from 'file-saver';

import RaisedButton from 'material-ui/RaisedButton';
import LoopIcon from 'material-ui/svg-icons/av/loop';

export default class FileDownloader extends Component {
  constructor(props) {
    super(props);

    this.state = { downloading: false };
  }

  handleClick = () => {
    this.setState({ downloading: true }, () => {
      Meteor.call('downloadFile', this.props.fileKey, (err, data) => {
        this.setState({ downloading: false });

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
      <RaisedButton
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
