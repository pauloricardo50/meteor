import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import cleanMethod from '/imports/api/cleanMethods';

import DropzoneComponent from 'react-dropzone-component';


export default class DropzoneInput extends Component {
  constructor(props) {
    super(props);

    const that = this;

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.pdf'],
      showFiletypeIcon: !this.props.currentValue || (this.props.currentValue && this.props.currentValue.length < 1), // Show if there are no uploaded files
      postUrl: '/', // Modified later
    };

    this.djsConfig = {
      method: 'POST',
      autoProcessQueue: true,
      dictDefaultMessage: this.props.message || 'Déposez un ou plusieurs fichiers ici, ou cliquez pour choisir',
      dictCancelUpload: 'Annuler',
      dictCancelUploadConfirmation: 'Êtes-vous sûr?',
      dictRemoveFile: 'Supprimer',
      dictInvalidFileType: 'Vous ne pouvez pas uploader un fichier de ce type',
      maxFilesize: 100, // MB
      clickable: true,
      acceptedFiles: 'image/*,application/pdf',
      renameFileName(fileName) {
        return 'hi' + fileName;
      },
      // addRemoveLinks: true, // TODO
      parallelUploads: 1,
      uploadMultiple: false,
      accept(file, done) {
        const uploader = new Slingshot.Upload('myFileUploads', that.props);

        uploader.file = file;
        uploader.request((error, instructions) => {
          if (error) {
            done(error.message);
          } else {
            // options.url = instructions.upload + '/' + instructions.postData[0].value;
            this.options.url = instructions.upload;
            file.postData = instructions.postData;
            done();
          }
        });
      },
    };

    this.eventHandlers = {
      init: (dropzone) => this.getUploadedFiles(dropzone),
      success: (file, response) => {
        this.handleSave(file);
      },
      removedFile: (file) => {
        // TODO: Add logic to remove file from DB and server
      },
      sending: function (file, xhr, formData) {
        file.postData.forEach((field) => {
          formData.append(field.name, field.value);
        });
      },
    };
  }

  handleSave(file) {
    let fileNameCount = '00';
    let fileCount = 0;
    if (this.props.currentValue) {
      fileCount = Math.max(...this.props.currentValue.map(f => f.fileCount)) + 1;
      fileNameCount = fileCount < 10 ? `0${fileCount}` : fileCount;
    }

    const object = {};
    object[this.props.id] = {
      name: `${fileNameCount}${file.name}`,
      size: file.size,
      type: file.type,
      url: file.xhr.responseURL,
      key: file.postData[0].value,
      fileCount,
    };

    cleanMethod('push', this.props.requestId, object);
  }

  getUploadedFiles(myDropzone) {
    // https://github.com/enyo/dropzone/wiki/FAQ#how-to-show-files-already-stored-on-server
    if (this.props.currentValue) {
      this.props.currentValue.forEach((file) => {
        myDropzone.emit('addedfile', file);
        myDropzone.emit('complete', file);
      });
    }
  }


  render() {
    return (
      <div>
        {this.props.label && <h3 htmlFor={this.props.id}>{this.props.label}</h3>}
        <DropzoneComponent
          name={this.props.id}
          config={this.componentConfig}
          eventHandlers={this.eventHandlers}
          djsConfig={this.djsConfig}
        />
      </div>
    );
  }
}

DropzoneInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  message: PropTypes.string,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  folderName: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};
