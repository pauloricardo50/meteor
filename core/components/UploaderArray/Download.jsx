import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import fileSaver from 'file-saver';

import IconButton from 'core/components/IconButton';
import { T } from 'core/components/Translation';

export default class Download extends Component {
  constructor(props) {
    super(props);

    this.state = { downloading: false };
  }

  handleClick = () => {
    const { fileKey, fileName } = this.props;
    this.setState({ downloading: true }, () => {
      Meteor.call('downloadFile', fileKey, (err, data) => {
        this.setState({ downloading: false });

        if (err) {
          console.log(err);
        } else {
          const blob = new Blob([data.Body], { type: data.ContentType });
          fileSaver.saveAs(blob, fileName);
        }
      });
    });
  };

  render() {
    const { fileKey, fileName } = this.props;
    const { downloading } = this.state;

    return (
      <IconButton
        touch={false}
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
