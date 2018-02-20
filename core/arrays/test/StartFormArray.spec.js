/* eslint-env mocha */
import { expect } from 'chai';
import isArray from 'lodash/isArray';
import getFormArray from '../StartFormArray';

const checkType = (value, type) => {
  if (value !== undefined) {
    if (type === 'array') {
      expect(isArray(value)).to.equal(true);
    } else if (isArray(type)) {
      expect(typeof value).to.be.oneOf(type);
    } else {
      expect(typeof value).to.equal(type);
    }
  }
};

describe('StartFormArray', () => {
  describe('getFormArray', () => {
    const array = getFormArray({}, {}, () => {});

    it('returns an array', () => {
      expect(array).to.have.length.above(0);
      expect(isArray(array)).to.equal(true);
    });

    it('should have unique ids for each item', () => {
      const ids = array.map(item => item.id);

      const temp = [];
      const result = ids.every((id) => {
        if (temp.indexOf(id) >= 0) {
          return false;
        }
        temp.push(id);
        return true;
      });

      expect(result).to.equal(true);
    });

    it('each item should have at least the id and type props', () => {
      array.forEach((item) => {
        expect(item.id).to.not.equal(undefined);
        expect(item.type).to.not.equal(undefined);
      });
    });

    it('type should be one of the allowed ones', () => {
      array.forEach(item =>
        expect(item.type).to.be.oneOf([
          'textInput',
          'buttons',
          'multipleInput',
          'arrayInput',
          'sliderInput',
          'custom',
        ]));
    });

    const allKeys = [
      { key: 'id', type: 'string' },
      { key: 'type', type: 'string' },
      { key: 'condition', type: 'boolean' },
      { key: 'money', type: 'boolean' },
      { key: 'intlValues', type: 'object' },
      { key: 'hideResult', type: 'boolean' },
      { key: 'buttons', type: 'array' },
      { key: 'question', type: 'boolean' },
      { key: 'deleteId', type: 'string' },
      { key: 'text2', type: 'boolean' },
      { key: 'placeholder', type: 'string' },
      { key: 'number', type: 'boolean' },
      { key: 'width', type: 'number' },
      { key: 'validation', type: ['object', 'function'] },
      { key: 'firstMultiple', type: 'boolean' },
      { key: 'zeroAllowed', type: 'boolean' },
      { key: 'existId', type: 'string' },
      { key: 'inputs', type: 'array' },
      { key: 'allOptions', type: 'boolean' },
      { key: 'child1', type: 'object' },
      { key: 'sliderMin', type: 'number' },
      { key: 'sliderMax', type: 'number' },
      { key: 'initialValue', type: 'number' },
      { key: 'sliderLabels', type: 'object' },
      { key: 'step', type: 'number' },
      { key: 'onDragStart', type: 'function' },
      { key: 'component', type: 'function' },
      { key: 'minFortune', type: 'number' },
      { key: 'fortune', type: 'number' },
      { key: 'sliders', type: 'object' },
      { key: 'error', type: 'boolean' },
    ];

    it('each item should only have allowed keys', () => {
      const allowedKeys = allKeys.map(key => key.key);
      array.forEach((item) => {
        const keys = Object.keys(item);

        keys.forEach(key => expect(key).to.be.oneOf(allowedKeys));
      });
    });

    it('types of each property should be correct', () => {
      array.forEach((item) => {
        allKeys.forEach((key) => {
          checkType(item[key.key], key.type);
        });
      });
    });

    describe('textInput', () => {
      const textInputs = array.filter(item => item.type === 'textInput');

      it('should have only allowed keys', () => {
        textInputs.forEach((item) => {
          const keys = Object.keys(item);

          keys.forEach(key =>
            expect(key).to.be.oneOf([
              'id',
              'type',
              'condition',
              'money',
              'text2',
              'placeholder',
              'number',
              'width',
              'validation',
            ]));
        });
      });

      it('should have money or number to true, but not both', () => {
        textInputs.forEach((input) => {
          if (input.money) {
            expect(!!input.number).to.equal(false);
          } else if (input.number) {
            expect(!!input.money).to.equal(false);
          }
        });
      });
    });

    describe('buttons', () => {
      const buttons = array.filter(item => item.type === 'buttons');

      it('each button should have only allowed keys', () => {
        buttons.forEach((button) => {
          const keys = Object.keys(button);

          keys.forEach(key =>
            expect(key).to.be.oneOf([
              'id',
              'condition',
              'type',
              'intlValues',
              'hideResult',
              'buttons',
              'question',
              'deleteId',
              'text2',
              'error',
            ]));
        });
      });

      it('each button should have an id, except for help buttons', () => {
        buttons.forEach((input) => {
          input.buttons.forEach((button) => {
            if (!button.help) {
              expect(button.id).to.not.equal(undefined);
            }
          });
        });
      });

      it('should have a buttons key with a non-empty array', () => {
        buttons.forEach((input) => {
          expect(isArray(input.buttons)).to.equal(true);
          expect(input.buttons).to.have.length.above(0);
        });
      });

      const buttonProps = [
        { key: 'id', type: 'string' },
        { key: 'noPrimary', type: 'boolean' },
        { key: 'secondary', type: 'boolean' },
        { key: 'className', type: 'string' },
        { key: 'label', type: 'object' },
        { key: 'onClick', type: 'function' },
        { key: 'help', type: 'boolean' },
        { key: 'component', type: 'object' },
      ];

      it('inputs should only have allowed properties', () => {
        const allowedKeys = buttonProps.map(prop => prop.key);
        buttons.forEach((input) => {
          input.buttons.forEach((button) => {
            const keys = Object.keys(button);
            keys.forEach(key => expect(key).to.be.oneOf(allowedKeys));
          });
        });
      });

      it('props should have the right type', () => {
        buttons.forEach((input) => {
          buttonProps.forEach((prop) => {
            checkType(input[prop.key], prop.type);
          });
        });
      });
    });

    describe('arrayInput', () => {
      const arrayInputs = array.filter(input => input.type === 'arrayInput');

      it('should have only allowed keys', () => {
        arrayInputs.forEach((input) => {
          const keys = Object.keys(input);

          keys.forEach(key =>
            expect(key).to.be.oneOf([
              'id',
              'type',
              'condition',
              'existId',
              'inputs',
              'allOptions',
            ]));
        });
      });

      it('should have the required keys', () => {
        arrayInputs.forEach((input) => {
          expect(!!input.existId).to.equal(true);
          expect(isArray(input.inputs)).to.equal(true);
        });
      });
    });
  });
});
