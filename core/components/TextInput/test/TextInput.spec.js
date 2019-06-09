/* eslint-env mocha */
import { expect } from 'chai';

import { getFinalPlaceholder } from '../TextInput';

describe('getFinalPlaceholder', () => {
  context('when noIntl is false', () => {
    it('should return a placeholder with a prefix', () => {
      const intl = {
        formatMessage: ({ id }) => id,
      };
      const prefix = 'Forms.textInput.placeholderPrefix';
      const placeholder = 'placeholer';
      const options = {
        noIntl: false,
        intl,
        placeholder,
      };
      expect(getFinalPlaceholder(options)).to.equal(`${prefix} ${placeholder}`);
    });

    it('should return default placeholder if no placeholder is provided', () => {
      const intl = {
        formatMessage: ({ id }) => id,
      };
      const defaultPlaceholder = 'defaultPlaceholder';
      const options = {
        noIntl: false,
        intl,
        defaultPlaceholder,
      };
      expect(getFinalPlaceholder(options)).to.equal(defaultPlaceholder);
    });

    it('should return defaultPlaceholder when type is money', () => {
      const defaultPlaceholder = 'defaultPlaceholder';
      const options = {
        defaultPlaceholder,
        type: 'money',
      };

      expect(getFinalPlaceholder(options)).to.equal(defaultPlaceholder);
    });
  });
  context('when noIntl is true', () => {
    it('should return placeholder when it is defined', () => {
      const placeholder = 'placeholder';
      const options = {
        noIntl: true,
        placeholder,
      };
      expect(getFinalPlaceholder(options)).to.equal(placeholder);
    });

    it('should return default placeholder when no placeholder is defined', () => {
      const placeholder = undefined;
      const defaultPlaceholder = 'defaultPlaceholder';
      const options = {
        noIntl: true,
        placeholder,
        defaultPlaceholder,
      };
      expect(getFinalPlaceholder(options)).to.equal(defaultPlaceholder);
    });
  });
});
