// @flow
import React from 'react';
import cx from 'classnames';
import { Element } from 'react-scroll';

import SimpleBorrowersPageMaxPropertyValueSticky from './SimpleBorrowersPageMaxPropertyValueSticky';
import SimpleMaxPropertyValue from '../../../components/SimpleMaxPropertyValue';
import SimpleMaxPropertyValueLightTheme from '../../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueLightTheme';

type SimpleBorrowersPageMaxPropertyValueProps = {};

const SimpleBorrowersPageMaxPropertyValue = ({
  hasEnoughHeight,
  isMobile,
  ...props
}: SimpleBorrowersPageMaxPropertyValueProps) => {
  if (isMobile) {
    return <SimpleBorrowersPageMaxPropertyValueSticky {...props} />;
  }

  return (
    <>
      {hasEnoughHeight && (
        <div className="simple-borrowers-page-max-property-value-placeholder" />
      )}

      <Element
        name="max-property-value-element"
        className="max-property-value-element"
      >
        <div
          className={cx(
            'card1 card-top simple-borrowers-page-max-property-value',
            { fixed: hasEnoughHeight },
          )}
        >
          <SimpleMaxPropertyValueLightTheme>
            <SimpleMaxPropertyValue {...props} />
          </SimpleMaxPropertyValueLightTheme>
        </div>
      </Element>
    </>
  );
};

export default SimpleBorrowersPageMaxPropertyValue;
