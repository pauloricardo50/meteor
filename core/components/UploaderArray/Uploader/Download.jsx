import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fileSaver from 'file-saver';

import IconButton from 'core/components/IconButton';
import T from 'core/components/Translation';
import { downloadFile } from 'core/api';

export default class Download extends Component {
  constructor(props) {
    super(props);

    this.state = { downloading: false };
  }

  handleClick = () => {
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
  fileName: PropTypes.string.isRequired,
  fileKey: PropTypes.string.isRequired,
};
