import React from 'react';

export const makeRenderSummary = configArray => structure =>
  configArray.map(({ Component, id }) => (
    <Component key={id} structure={structure} />
  ));

export const makeRenderDetail = configArray => (structure) => {};
