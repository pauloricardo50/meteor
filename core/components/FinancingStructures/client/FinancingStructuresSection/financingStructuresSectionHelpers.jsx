import React from 'react';
import cx from 'classnames';

export const makeRenderSummary = configArray => ({ id: structureId }) =>
  configArray.map(({ Component, id, ...props }) =>
    (Component ? (
      <Component
        key={id}
        structureId={structureId}
        id={id}
        className={id}
        {...props}
      />
    ) : (
      <div className={cx('empty-line', id)} />
    )));

export const makeRenderDetail = configArray => ({ id: structureId }) =>
  configArray.map(({ Component, id, ...props }) =>
    (Component ? (
      <Component
        key={id}
        structureId={structureId}
        id={id}
        className={id}
        {...props}
      />
    ) : (
      <div className={cx('empty-line', id)} />
    )));
