// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from '../../../utils/testHelpers/enzyme';

import { mapPropertyDocumentsIntoProperty } from '../mergeFilesWithQuery';

const Component = props => <div {...props} />;

describe.only('mergeFilesWithQuery', () => {
  describe('mapPropertyDocumentsIntoProperty', () => {
    let props;
    const propertyId = 'propertyId';
    const WrappedComponent = mapPropertyDocumentsIntoProperty(Component);
    const component = () => mount(<WrappedComponent {...props} />);

    beforeEach(() => {
      props = {
        loan: {
          structure: { property: {}, propertyId },
          properties: [{ _id: propertyId }],
        },
      };
    });

    it('takes files from the property and injects it into the structure', () => {
      const documents = 'some documents';
      props.loan.properties[0].documents = documents;

      expect(component()
        .find('div')
        .props().loan.structure.property.documents).to.deep.equal(documents);
    });

    it('does not do anything if the documents does not exist', () => {
      props.loan.properties[0];

      expect(component()
        .find('div')
        .props().loan.structure.property.documents).to.deep.equal(undefined);
    });

    it('does not do anything if the property does not exist', () => {
      props.loan.properties = [];

      expect(component()
        .find('div')
        .props().loan.structure.property.documents).to.deep.equal(undefined);
    });
  });
});
