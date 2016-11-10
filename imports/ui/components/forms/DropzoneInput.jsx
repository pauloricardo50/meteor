import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/creditrequests/methods.js';

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

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/uploadHandler',
};
const djsConfig = { autoProcessQueue: true };


export default class DropzoneInput extends Component {
  constructor(props) {
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
  }


  handleDrop(file) {
    const id = this.props.requestId;
    const object = {};
    object[`files.${this.props.fileName}`] = {
      url: file.name, // TODO: Put real URL here when it works
    };

    console.log(object);

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        console.log(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        return 'File Upload Successful';
      }
    });
  }


  render() {
    const eventHandlers = {
      addedfile: file => this.handleDrop(file),
    };

    return (
      <DropzoneComponent
        config={componentConfig}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}

DropzoneInput.propTypes = {
  fileName: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
};
