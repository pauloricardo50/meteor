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

const renderArray = (configArray, sectionProps, structureId) =>
  configArray
    .filter(makeFilterConfig(sectionProps))
    .map(({ Component, id, ...props }) =>
      (Component ? (
        <Component
          key={id}
          structureId={structureId}
          id={id}
          className={id}
          {...sectionProps}
          {...props}
        />
      ) : (
        <div className={cx('empty-line', id)} key={id} />
      )));

export const makeRenderSummary = configArray => (structure, sectionProps) => {
  const { id: structureId } = structure;

  return (
    <div className="structure" key={structureId}>
      {renderArray(configArray, { ...sectionProps, structure }, structureId)}
    </div>
  );
};

export const makeRenderDetail = (configArray, sectionItemProps = {}) => (
  structure,
  sectionProps,
) => {
  const { id: structureId } = structure;
  const { className } = sectionItemProps;
  return (
    <div className={cx('structure', className)} key={structureId}>
      <span className="card1">
        {renderArray(configArray, { ...sectionProps, structure }, structureId)}
      </span>
    </div>
  );
};
