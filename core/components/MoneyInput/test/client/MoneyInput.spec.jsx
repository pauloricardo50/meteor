/* eslint-env mocha */
import React, { useState } from 'react';
import { expect } from 'chai';

import {
  cleanup,
  fireEvent,
  render,
} from '../../../../utils/testHelpers/testing-library';
import MoneyInput from '../../MoneyInput';

const Component = ({ overrideValue, ...props }) => {
  const [value, setValue] = useState(0);
  return (
    <>
      <label htmlFor="money-input">Money input</label>
      <MoneyInput
        id="money-input"
        value={overrideValue || value}
        onChange={setValue}
        {...props}
      />
    </>
  );
};

describe('test suite name', () => {
  beforeEach(() => cleanup());

  it('displays a money value in the input', () => {
    const { getByLabelText } = render(<Component />);

    const input = getByLabelText('Money input');
    expect(input.value).to.equal('0');
  });

  it('formats the money value with separators', () => {
    const { getByLabelText } = render(<Component />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input.value).to.equal('123 456');
  });

  it('does not allow decimals by default', () => {
    const { getByLabelText } = render(<Component />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '123456.123' } });
    expect(input.value).to.equal('123 456 123');
  });

  it('allows 2 decimals', () => {
    const { getByLabelText } = render(<Component decimal />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '123456.123' } });
    expect(input.value).to.equal('123 456.12');
  });

  it('does not allow negative values by default', () => {
    const { getByLabelText } = render(<Component />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '-12' } });
    expect(input.value).to.equal('12');
  });

  it('allows negative if specified', () => {
    const { getByLabelText } = render(<Component negative />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '-12' } });
    expect(input.value).to.equal('-12');
  });

  it('allows leading zeroes', () => {
    const { getByLabelText } = render(<Component />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '050000' } });

    expect(input.value).to.equal('050 000');
  });

  it('replaces the maskedValue state if the value changes', () => {
    const { getByLabelText, rerender } = render(<Component />);

    const input = getByLabelText('Money input');
    fireEvent.change(input, { target: { value: '0012' } });

    expect(input.value).to.equal('0 012');

    rerender(<Component overrideValue={13} />);

    expect(input.value).to.equal('13');
  });
});
