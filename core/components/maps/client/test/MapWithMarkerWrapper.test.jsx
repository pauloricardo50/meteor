/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import MapWithMarkerWrapper from '../../MapWithMarkerWrapper';
import MapWithMarker from '../../MapWithMarker';

import { getAddressString } from '../../googleMapsHelpers';

const component = props => shallow(<MapWithMarkerWrapper {...props} />);

describe('MapWithMarkerWrapper', () => {
  let address;

  beforeEach(() => {
    address = { address1: 'Thamel Marg', city: 'Kathmandu', zipCode: '123456' };
  });

  it("doesn't render MapWithMarker if the address is incomplete", () => {
    address = { city: 'Kathmandu', zipCode: '123456' };
    const errorParagraph = component(address).find('.incomplete-address');
    expect(errorParagraph.length).to.equal(1);
  });

  it('renders MapWithMarker if address is complete', () =>
    expect(component(address).find(MapWithMarker).length).to.equal(1));

  it('passes the correct address to the MapWithMarker component', () =>
    expect(component(address)
      .find(MapWithMarker)
      .first()
      .prop('address')).to.equal(getAddressString(address)));
});
