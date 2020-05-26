/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import {
  cleanup,
  render,
  waitFor,
} from '../../../../utils/testHelpers/testing-library';
import { PageHead } from '../../PageHead';

describe('PageHead', () => {
  beforeEach(() => {
    document.title = '';
    return cleanup();
  });

  it('renders a title tag with just e-Potek in it if no title is provided', async () => {
    render(<PageHead />);
    await waitFor(() => expect(document.title).to.equal('e-Potek'));
  });

  it('renders the title with more stuff if titleId is provided', async () => {
    await waitFor(() => expect(document.title).to.equal(''));
    render(<PageHead titleId="BorrowersPage" />);
    await waitFor(() =>
      expect(document.title).to.equal('e-Potek | Emprunteurs'),
    );
  });

  it('does not add .title at the end of the i18n id if it is already provided', async () => {
    await waitFor(() => expect(document.title).to.equal(''));
    render(<PageHead titleId="BorrowersPage.title" />);
    await waitFor(() =>
      expect(document.title).to.equal('e-Potek | Emprunteurs'),
    );
  });

  it('does not render a description tag if no descriptionId is provided', () => {
    render(<PageHead />);
    expect(
      document
        .querySelector(`meta[name="description"]`)
        ?.getAttribute('content'),
    ).to.equal(undefined);
  });

  it('renders a description tag if a descriptionId is provided', async () => {
    render(<PageHead descriptionId="general.yes" />);
    await waitFor(() =>
      expect(
        document
          .querySelector(`meta[name="description"]`)
          .getAttribute('content'),
      ).to.equal('Oui'),
    );
  });
});
