/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
} from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import getSteps from 'core/arrays/steps';
import ProcessPage, { getStepValues } from '../ProcessPage';

if (Meteor.isClient) {
  describe('<ProcessPage />', () => {
    let props;
    const component = () => getMountedComponent(ProcessPage, props, true);

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      getMountedComponent.reset();

      const userId = Factory.create('user')._id;
      const borrower = Factory.create('borrower', { userId });
      const request = Factory.create('loanRequest', {
        userId,
        borrowers: [borrower._id],
      });

      props = {
        loanRequest: request,
        borrowers: [borrower],
        stepNb: 1,
        id: 'personal',
        // location: {
        //   history: {},
        // },
        // history: {},
      };
    });

    afterEach(() => {
      stubCollections.restore();
    });

    it('Renders correctly before auction', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
    });

    it('Changes the page title when the id changes', () => {
      const initialTitle = document.title;
      expect(!!initialTitle).to.equal(true);
      props.id = 'files';
      const c = component();
      const newTitle = document.title;
      expect(initialTitle).to.not.equal(newTitle);
    });
  });
}

describe('getStepValues', () => {
  let parameters;

  beforeEach(() => {
    resetDatabase();
    stubCollections();

    const userId = Factory.create('user')._id;
    const borrower = Factory.create('borrower', { userId });
    const request = Factory.create('loanRequest', {
      userId,
      borrowers: [borrower._id],
    });

    parameters = {
      stepNb: 1,
      id: 'files',
      loanRequest: request,
      borrowers: [borrower],
    };
  });

  afterEach(() => {
    stubCollections.restore();
    resetDatabase();
  });

  it('Works for any item of a step', () => {
    const steps = getSteps(parameters);

    expect(getStepValues(parameters).index).to.equal(2);
    expect(getStepValues(parameters).length).to.equal(5);
    expect(getStepValues(parameters).prevLink).to.equal(steps[1].items[1].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[1].items[3].link);
  });

  it('Works for the last item of a step', () => {
    parameters.id = 'verification';

    const steps = getSteps(parameters);

    expect(getStepValues(parameters).index).to.equal(4);
    expect(getStepValues(parameters).length).to.equal(5);
    expect(getStepValues(parameters).prevLink).to.equal(steps[1].items[3].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[2].items[0].link);
  });
});
