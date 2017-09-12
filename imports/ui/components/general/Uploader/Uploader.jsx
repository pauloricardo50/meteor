import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Title from './Title';
import File from './File';
import FileAdder from './FileAdder';

export default class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempFiles: [],
    };
  }

  handleDrop = ({ target }) => {
    console.log(target.files);
  };

  render() {
    const { file, doc } = this.props;
    const { id } = file;

    // All files are always stored at the root of an object in 'files'
    const currentValue = doc.files[id];

    return (
      <div className="uploader">
        <Title {...file} currentValue={currentValue} />
        {currentValue && currentValue.map(f => <File key={f.key} {...f} />)}
        <FileAdder id={file.id} handleDrop={this.handleDrop} />
      </div>
    );
  }
}

Uploader.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};
