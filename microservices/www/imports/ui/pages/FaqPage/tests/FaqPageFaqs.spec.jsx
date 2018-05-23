/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { T } from 'core/components/Translation';
import FaqPageFaqs from '../FaqPageFaqs';

describe('FaqPageFaqs', () => {
  let props;
  let faqs;
  const component = () => shallow(<FaqPageFaqs {...props} />);

  beforeEach(() => {
    faqs = ['test1', 'test2'];
    props = { faqs };
  });

  describe('for each FAQ', () => {
    it('renders an expansion panel', () => {
      const panels = component().find(ExpansionPanel);
      expect(panels.length).to.equal(faqs.length);
    });

    it('renders expansion summary with a question', () => {
      const panels = component().find(ExpansionPanel);
      panels.forEach((panel, index) => {
        expect(panel.find(ExpansionPanelSummary).length).to.equal(1);
        expect(panel.find(ExpansionPanelSummary).find(T).length).to.equal(1);
        expect(panel
          .find(ExpansionPanelSummary)
          .find(T)
          .first()
          .prop('id')).to.equal(`FaqPageFaqs.${faqs[index]}.question`);
      });
    });

    it('renders expansion details', () => {
      const panels = component().find(ExpansionPanel);
      panels.forEach((panel, index) => {
        expect(panel.find(ExpansionPanelDetails).length).to.equal(1);
        expect(panel.find(ExpansionPanelDetails).find(T).length).to.equal(1);
        expect(panel
          .find(ExpansionPanelDetails)
          .find(T)
          .first()
          .prop('id')).to.equal(`FaqPageFaqs.${faqs[index]}.answer`);
      });
    });
  });
});
