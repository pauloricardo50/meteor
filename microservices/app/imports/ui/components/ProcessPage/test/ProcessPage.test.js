/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
  generateData,
} from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import getSteps from 'core/arrays/steps';
import { spy } from 'sinon';

import { ProcessPage, getStepValues } from '../ProcessPage';

if (Meteor.isClient) {
  describe('<ProcessPage />', () => {
    let props;
    let setStepSpy;
    const component = () =>
      getMountedComponent({ Component: ProcessPage, props, withRouter: true });

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      getMountedComponent.reset();

      const data = generateData();
      setStepSpy = spy();

      props = {
        ...data,
        stepNb: 1,
        id: 'personal',
        intl: {
          formatMessage: ({ id }) => id,
        },
        setStep: setStepSpy,
      };
    });

    afterEach(() => {
      stubCollections.restore();
    });

    // FIXME: Stop skipping these when enzyme support React 16.3
    // https://github.com/airbnb/enzyme/pull/1513
    it.skip('Renders correctly before auction', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
    });

    it.skip('Changes the page title when the id changes', () => {
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

    const data = generateData();

    parameters = {
      ...data,
      stepNb: 1,
      id: 'files',
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
    expect(getStepValues(parameters).prevLink).to.equal(steps[0].items[1].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[0].items[3].link);
  });

  it('Works for the last item of a step', () => {
    parameters.id = 'verification';

    const steps = getSteps(parameters);

    expect(getStepValues(parameters).index).to.equal(4);
    expect(getStepValues(parameters).length).to.equal(5);
    expect(getStepValues(parameters).prevLink).to.equal(steps[0].items[3].link);
    expect(getStepValues(parameters).nextLink).to.equal(steps[1].items[0].link);
  });
});
