import React from 'react';

export const steps = [
  { id: 'purchaseType', Component: () => <div>Yoo1</div> },
  { id: 'whereYouAt', Component: () => <div>Yoo2</div> },
];

export const getStepIds = () => steps.filter(x => x).map(({ id }) => id);
