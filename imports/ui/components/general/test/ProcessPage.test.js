import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import ProcessPage from '../ProcessPage.jsx';
import { getStepValues } from '../ProcessPage.jsx';
import getSteps from '/imports/js/arrays/steps';

if (Meteor.isClient) {
  describe('<ProcessPage />', () => {
    let props;
    const component = () => getMountedComponent(ProcessPage, props, true);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {
        loanRequest: Factory.create('loanRequest'),
        borrowers: [Factory.create('borrower')],
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

    it('Changes the page title when the id changes', () => {
      const initialTitle = document.title;
      expect(!!initialTitle).to.be.true;
      props.id = 'files';
      const c = component();
      const newTitle = document.title;
      expect(initialTitle).to.not.equal(newTitle);
    });
  });
}

describe('getStepValues', () => {
  it('Works for any item of a step', () => {
    const parameters = {
      stepNb: 1,
      id: 'files',
      loanRequest: Factory.create('loanRequest'),
      borrowers: [Factory.create('borrower')],
    };

    const steps = getSteps(parameters);

    expect(getStepValues(parameters).index).to.equal(2);
    expect(getStepValues(parameters).length).to.equal(5);
    expect(getStepValues(parameters).prevLink).to.equal(steps[1].items[1].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[1].items[3].link);
  });

  it('Works for the last item of a step', () => {
    const parameters = {
      stepNb: 1,
      id: 'verification',
      loanRequest: Factory.create('loanRequest'),
      borrowers: [Factory.create('borrower')],
    };

    const steps = getSteps(parameters);

    expect(getStepValues(parameters).index).to.equal(4);
    expect(getStepValues(parameters).length).to.equal(5);
    expect(getStepValues(parameters).prevLink).to.equal(steps[1].items[3].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[2].items[0].link);
  });
});
