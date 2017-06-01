import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import ProcessPage from '../ProcessPage.jsx';
import { getStepValues } from '../ProcessPage.jsx';

if (Meteor.isClient) {
  describe('<ProcessPage />', () => {
    let props;
    const component = () => getMountedComponent(ProcessPage, props, true);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {
        loanRequest: Factory.create('loanRequest'),
        borrowers: [{}],
        stepNb: 1,
        id: 'personal',
        // location: {
        //   history: {},
        // },
        // history: {},
      };
    });

    it('Renders correctly before auction', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
    });
  });
}

// describe('getStepValues', () => {
//   let props;
//
//   beforeEach(() => {
//     props = {};
//   });
//
//   it('Works propery', () => {
//     const parameters = {
//       stepNb: 1,
//       id: 'verification',
//     };
//
//     expect(getStepValues(parameters)).to.deep.equal({
//       currentStep: '',
//       index: 1,
//       length: 4,
//       nextLink: '',
//       prevLink: '',
//     });
//   });
// });
