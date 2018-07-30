import React from 'react';
import cx from 'classnames';

export const makeFilterConfig = structures => ({ condition }) => {
  if (!condition) {
    // Render components without condition property
    return true;
  }
  if (typeof condition === 'function') {
    return condition(structures);
  }
  return !!condition;
};

export const makeRenderSummary = configArray => (
  { id: structureId },
  data,
  index,
) => configArray
  .filter(makeFilterConfig(data))
  .map(({ Component, id, ...props }) => (Component ? (
    <Component
      key={id}
      structureId={structureId}
      id={id}
      className={id}
      {...props}
    />
  ) : (
    <div className={cx('empty-line', id)} key={id} />
  )));

export const makeRenderDetail = configArray => (
  { id: structureId },
  data,
  index,
) => configArray
  .filter(makeFilterConfig(data))
  .map(({ Component, id, ...props }) => (Component ? (
    <Component
      key={id}
      structureId={structureId}
      id={id}
      className={id}
      {...props}
    />
  ) : (
    <div className={cx('empty-line', id)} key={id} />
  )));
