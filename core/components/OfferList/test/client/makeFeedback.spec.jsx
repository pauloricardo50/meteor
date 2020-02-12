/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { injectIntl } from 'react-intl';

import { getMountedComponent } from '../../../../utils/testHelpers';
import { makeFeedback, FEEDBACK_OPTIONS } from '../../feedbackHelpers';
import HtmlPreview from '../../../HtmlPreview/HtmlPreview';

const DummyComponent = ({ intl: { formatMessage }, model, offer }) => (
  <HtmlPreview value={makeFeedback({ model, offer, formatMessage })} />
);

const component = props =>
  getMountedComponent({
    Component: injectIntl(DummyComponent),
    props,
    withRouter: false,
  });

describe('makeFeedback', () => {
  beforeEach(() => {
    getMountedComponent.reset();
  });

  // Not working during meteor tests
  it.skip('renders the feedback with correct intl values', () => {
    const model = { option: FEEDBACK_OPTIONS.POSITIVE };
    const offer = {
      lender: {
        contact: { firstName: 'Bob' },
        loan: {
          borrowers: [{ name: 'John' }],
          user: { assignedEmployee: { name: 'Julia' } },
        },
      },
      property: {
        address1: 'Rue du test 1',
        zipCode: '1201',
        city: 'Genève',
      },
      createdAt: new Date(),
    };
    expect(
      component({ model, offer })
        .text()
        .includes('Bob'),
    ).to.equal(true);
    expect(
      component({ model, offer })
        .text()
        .includes('John'),
    ).to.equal(true);
    expect(
      component({ model, offer })
        .text()
        .includes('Julia'),
    ).to.equal(true);
    expect(
      component({ model, offer })
        .text()
        .includes('Rue du test 1, 1201 Genève'),
    ).to.equal(true);
  });
});
