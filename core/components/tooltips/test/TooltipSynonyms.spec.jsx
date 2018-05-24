/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from '../../../utils/testHelpers/enzyme';
import { TooltipSynonyms } from '../TooltipSynonyms';

describe('TooltipSynonyms', () => {
  let props;
  const component = () => shallow(<TooltipSynonyms {...props} />);

  beforeEach(() => {
    props = { tooltips: {} };
  });

  it('renders null if no tooltipId is passed', () => {
    expect(component().getElement()).to.equal(null);
  });

  it('renders null if no tooltipId is passed', () => {
    expect(component().getElement()).to.equal(null);
  });

  it('does not render a synonym if none other exists', () => {
    props = {
      tooltipId: 'test',
      match: 'match1',
      tooltips: { match1: { id: 'test' } },
    };

    expect(component().getElement()).to.equal(null);
    expect(component().contains('match1')).to.equal(false);
  });

  it('renders a synonym if 2 exist, but not the match', () => {
    props = {
      tooltipId: 'test',
      match: 'match2',
      tooltips: { match1: { id: 'test' }, match2: { id: 'test' } },
    };

    expect(component().contains('match2, match1')).to.equal(false);
    expect(component().contains('match1')).to.equal(true);
  });

  it('renders 2 synonyms if 3 exist, but not the match', () => {
    props = {
      tooltipId: 'test',
      match: 'match2',
      tooltips: {
        match1: { id: 'test' },
        match2: { id: 'test' },
        match3: { id: 'test' },
      },
    };

    expect(component().contains('match1, match3')).to.equal(true);
  });

  it('ignores case', () => {
    props = {
      tooltipId: 'test',
      match: 'Match2',
      tooltips: { match1: { id: 'test' }, match2: { id: 'test' } },
    };

    expect(component().contains('match2, match1')).to.equal(false);
    expect(component().contains('match1')).to.equal(true);
  });
});
