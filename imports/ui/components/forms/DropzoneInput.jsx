import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods.js';

import DropzoneComponent from 'react-dropzone-component';


// const options = {
//   paramName: 'file', // The name that will be used to transfer the file
//   maxFilesize: 2, // MB
//   dictDefaultMessage: 'Déposez un fichier ici ou cliquez pour uploader',
//   accept(file, done) {
//     if (file.name === 'justinbieber.jpg') {
//       done('We won\'t accept that!');
//     } else {
//       done();
//     }
//   },
// };


export default class DropzoneInput extends Component {
  constructor(props) {
    super(props);

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: '/uploadHandler',
    };

    this.djsConfig = {
      // Automatically starts processing files, else you have to callmyDropZone.processQueue()
      autoProcessQueue: true,
      dictDefaultMessage: 'Déposez un fichier ici ou cliquez pour uploader',
      maxFilesize: 50, // MB
      clickable: true, // Lets you click the dropzone
      acceptedFiles: 'image/*,application/pdf',
      renameFileName: this.props.fileRename,
    };

    this.eventHandlers = {
      // addedfile: file => handleFileUpload(file),
    };
  }


  render() {
    return (
      <DropzoneComponent
        config={this.componentConfig}
        eventHandlers={this.eventHandlers}
        djsConfig={this.djsConfig}
      />
    );
  }
}

DropzoneInput.propTypes = {
  fileName: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};
