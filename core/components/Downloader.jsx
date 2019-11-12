import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fileSaver from 'file-saver';

import IconButton from './IconButton';
import T from './Translation';
import { downloadFile } from '../api';

export default class Download extends Component {
  constructor(props) {
    super(props);

    this.state = { downloading: false };
  }

  handleClick = event => {
    event.preventDefault();
    const { fileKey, fileName } = this.props;
    this.setState({ downloading: true }, () => {
      downloadFile
        .run({ key: fileKey })
        .then(({ Body, ContentType: type }) => {
          const blob = new Blob([Body], { type });
          fileSaver.saveAs(blob, fileName);
        })
        .finally(() => this.setState({ downloading: false }));
    });
  };

  render() {
    const { downloading } = this.state;
    const { children } = this.props;

    if (children) {
      return children({ downloading, handleDownload: this.handleClick });
    }

    return (
      <IconButton
        type={downloading ? 'loop-spin' : 'download'}
        tooltip={<T id="general.download" />}
        onClick={this.handleClick}
        disabled={downloading}
      />
    );
  }
}

Download.propTypes = {
  fileKey: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
