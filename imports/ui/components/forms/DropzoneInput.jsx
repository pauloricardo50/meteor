import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

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
const djsConfig = { autoProcessQueue: false }
const eventHandlers = { addedfile: file => console.log(file) }


export default class DropzoneInput extends React.Component {
  render() {
    return (
      <DropzoneComponent
        config={componentConfig}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}
