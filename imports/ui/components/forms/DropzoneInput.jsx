import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { pushValue } from '/imports/api/loanrequests/methods.js';

import DropzoneComponent from 'react-dropzone-component';


export default class DropzoneInput extends Component {
  constructor(props) {
    super(props);

    const that = this;

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.pdf'],
      showFiletypeIcon: this.props.currentValue && this.props.currentValue.length < 1, // Show if there are no uploaded files
      postUrl: '/', // Modified later
    };

    this.djsConfig = {
      method: 'put',
      autoProcessQueue: true,
      dictDefaultMessage: this.props.message || 'Déposez un ou plusieurs fichiers ici, ou cliquez pour choisir',
      dictCancelUpload: 'Annuler',
      dictCancelUploadConfirmation: 'Êtes-vous sûr?',
      dictRemoveFile: 'Supprimer',
      dictInvalidFileType: 'Vous ne pouvez pas uploader un fichier de ce type',
      maxFilesize: 100, // MB
      clickable: true,
      acceptedFiles: 'image/*,application/pdf',
      renameFileName: 'myNewFile',
      // addRemoveLinks: true, // TODO
      parallelUploads: 1,
      uploadMultiple: false,
      accept(file, done) {
        that.uploader = new Slingshot.Upload('myFileUploads', that.props);
        const options = this.options;

        that.uploader.file = file;
        that.uploader.request((error, instructions) => {
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
      init: (dropzone) => this.getUploadedFiles(dropzone),
      success: (file, response) => {
        this.handleSave(file);
      },
      removedFile: (file) => {
        // TODO: Add logic to remove file from DB and server
      },
    };
  }

  handleSave(file) {
    const object = {};
    object[this.props.id] = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.xhr.responseURL,
    };

    pushValue.call({
      object,
      id: this.props.requestId,
    }, (err, res) => {
      if (err) {
        throw new Meteor.Error('pushValueError', err.message);
      } else {
        return 'yay!';
      }
    });
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
        <label htmlFor={this.props.id}>{this.props.label}</label>
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
  label: PropTypes.string.isRequired,
  message: PropTypes.string,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  folderName: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};
