import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { updateValues } from '/imports/api/loanrequests/methods.js';

import DropzoneComponent from 'react-dropzone-component';


export default class DropzoneInput extends Component {
  constructor(props) {
    super(props);

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.pdf'],
      showFiletypeIcon: true,
      postUrl: '/', // Modified later
    };

    this.djsConfig = {
      // Automatically starts processing files, else you have to callmyDropZone.processQueue()
      method: 'put',
      autoProcessQueue: true,
      dictDefaultMessage: 'Déposez un fichier ici ou cliquez pour en choisir un',
      maxFilesize: 100, // MB
      clickable: true, // Lets you click the dropzone
      acceptedFiles: 'image/*,application/pdf',
      renameFileName: this.props.fileRename || 'myFile',
      parallelUploads: 1,
      uploadMultiple: false,
      accept(file, done) {
        const upload = new Slingshot.Upload('myFileUploads');
        const options = this.options;

        upload.file = file;
        upload.request((error, instructions) => {
          if (error) {
            done(error.message);
          } else {
            options.url = instructions.upload + '/' + instructions.postData[0].value;
            file.postData = instructions.postData;
            done();
          }
        });
      },
    };

    this.eventHandlers = {
      success: (file, response) => {
        console.log(response);
        console.log(file);
      },
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
  fileRename: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};
