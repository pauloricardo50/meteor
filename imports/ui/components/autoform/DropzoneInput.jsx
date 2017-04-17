import PropTypes from 'prop-types';
import React from 'react';
import { Slingshot } from 'meteor/edgee:slingshot';
import cleanMethod from '/imports/api/cleanMethods';

import DropzoneComponent from 'react-dropzone-component';

const handleSave = (props, file) => {
  let fileNameCount = '00';
  let fileCount = 0;
  if (props.currentValue) {
    // Get a file count and prepend it to the file name
    fileCount = Math.max(...props.currentValue.map(f => f.fileCount)) + 1;
    fileNameCount = fileCount < 10 ? `0${fileCount}` : fileCount;
  }

  const object = {};
  object[props.id] = {
    name: `${fileNameCount}${file.name}`,
    size: file.size,
    type: file.type,
    url: file.xhr.responseURL,
    key: file.postData[0].value,
    fileCount,
  };

  console.log('pushing!');

  cleanMethod(props.pushFunc, object, props.documentId);
};

// Gets already uploaded files and simulates them being added to the dropzone
// so they appear properly
const getUploadedFiles = (props, myDropzone) => {
  // https://github.com/enyo/dropzone/wiki/FAQ#how-to-show-files-already-stored-on-server
  if (props.currentValue) {
    props.currentValue.forEach(file => {
      myDropzone.emit('addedfile', file);
      myDropzone.emit('complete', file);
    });
  }
};

const componentConfig = props => ({
  iconFiletypes: ['.jpg', '.png', '.pdf'],
  showFiletypeIcon: !props.currentValue ||
    (props.currentValue && props.currentValue.length < 1), // Show if there are no uploaded files
  postUrl: '/', // Modified later
});

const djsConfig = props => ({
  method: 'POST',
  autoProcessQueue: true,
  dictDefaultMessage: props.message,
  dictCancelUpload: 'Annuler',
  dictCancelUploadConfirmation: 'Êtes-vous sûr?',
  dictRemoveFile: 'Supprimer',
  dictInvalidFileType: 'Vous ne pouvez pas uploader un fichier de ce type',
  maxFilesize: 100, // MB
  clickable: true,
  acceptedFiles: 'image/*,application/pdf',
  renameFileName(fileName) {
    // not working
    return 'hi' + fileName;
  },
  // addRemoveLinks: true, // TODO
  parallelUploads: 1,
  uploadMultiple: false,
  accept(file, done) {
    const uploader = new Slingshot.Upload('myFileUploads', props);

    uploader.file = file;
    uploader.request((error, instructions) => {
      if (error) {
        console.log(error);
        done(error.message);
      } else {
        // options.url = instructions.upload + '/' + instructions.postData[0].value;
        this.options.url = instructions.upload;
        file.postData = instructions.postData;
        done();
      }
    });
  },
});

const eventHandlers = props => ({
  init: dropzone => getUploadedFiles(props, dropzone),
  success: (file, response) => {
    handleSave(props, file);
  },
  removedFile: file => {
    // TODO: Add logic to remove file from DB and server
  },
  sending: function(file, xhr, formData) {
    file.postData.forEach(field => {
      formData.append(field.name, field.value);
    });
  },
});

const DropzoneInput = props => (
  <div>
    {props.label && <h3 htmlFor={props.id}>{props.label}</h3>}
    <DropzoneComponent
      name={props.id}
      config={componentConfig(props)}
      eventHandlers={eventHandlers(props)}
      djsConfig={djsConfig(props)}
    />
  </div>
);

DropzoneInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  message: PropTypes.string,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  folderName: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  pushFunc: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
};

DropzoneInput.defaultProps = {
  label: '',
  message: 'Déposez un ou plusieurs fichiers ici, ou cliquez pour choisir',
  currentValue: undefined,
};

export default DropzoneInput;
