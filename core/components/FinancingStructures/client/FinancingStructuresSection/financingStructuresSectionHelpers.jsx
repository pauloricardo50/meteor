import React from 'react';

export const makeRenderSummary = configArray => ({ id: structureId }) =>
  configArray.map(({ Component, id, ...props }) =>
    (Component ? (
      <Component key={id} structureId={structureId} id={id} {...props} />
    ) : (
      <div className="empty-line" />
    )));

export const makeRenderDetail = configArray => ({ id: structureId }) =>
  configArray.map(({ Component, id, ...props }) =>
    (Component ? (
      <Component key={id} structureId={structureId} id={id} {...props} />
    ) : (
      <div className="empty-line" />
    )));
