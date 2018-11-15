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

const renderArray = (configArray, data, structureId) =>
  configArray
    .filter(makeFilterConfig(data))
    .map(({ Component, id, ...props }) =>
      (Component ? (
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

export const makeRenderSummary = configArray => ({ id: structureId }, data) => (
  <div className="structure" key={structureId}>
    {renderArray(configArray, data, structureId)}
  </div>
);

export const makeRenderDetail = (configArray, noWrapper) => (
  { id: structureId },
  data,
) => {
  if (noWrapper) {
    return (
      <div className="structure" key={structureId}>
        {renderArray(configArray, data, structureId)}
      </div>
    );
  }
  return (
    <div className="structure" key={structureId}>
      <span className="card1">
        {renderArray(configArray, data, structureId)}
      </span>
    </div>
  );
};
